// Tests for the crafting resolver (src/utils/crafting.ts).
//
// Runs with the built-in node test runner + type stripping — no dev deps:
//   node --test test/
//
// These capture issue #67 ("Inconsistent ingredient hint for thin shaped
// recipe"): an ambiguous guess must NOT over-prune the variant pool, and a
// guess placed in a still-valid position must turn green. They FAIL against
// the buggy tie-break in findRemainingVariantsIndices and pass once the
// pruning is fixed.

import { test } from "node:test";
import assert from "node:assert/strict";

import {
  resolveGuess,
  getVariantsWithReflections,
  compareTables,
} from "../src/utils/crafting.ts";

const P = "minecraft:planks";
const S = "minecraft:stick";
const COBBLE = "minecraft:cobblestone";

// solution from issue #67: two planks arranged vertically (the stick recipe)
const STICK_SOLUTION = [
  [P],
  [P],
];

const GLYPH = { 0: ".", 1: "~", 2: "G", 3: "Y" };
const glyphRow = (r) => r.map((v) => GLYPH[v]).join(" ");
const glyph = (colors) => colors.map(glyphRow).join(" | ");

const empty = () => [
  [null, null, null],
  [null, null, null],
  [null, null, null],
];

const put = (table, cells) => {
  for (const [r, c, item] of cells) table[r][c] = item;
  return table;
};

function variantsOfStick() {
  return getVariantsWithReflections(STICK_SOLUTION.map((row) => [...row]));
}

const distinctColumns = (variants) =>
  new Set(variants.map((v) => v[0].findIndex((c) => c === P)));

const assertNoGreens = (colors) => {
  for (const row of colors)
    for (const v of row)
      assert.notEqual(v, 2, `unexpected green slot: ${glyphRow(row)}`);
};

test("exact solution placement is all green", () => {
  const guess = put(empty(), [
    [0, 0, P],
    [1, 0, P],
  ]);
  const { remaining, colors } = resolveGuess(STICK_SOLUTION, variantsOfStick(), guess);
  assert.equal(colors[0][0], 2, "top cell green");
  assert.equal(colors[1][0], 2, "lower cell green");
  assert.ok(remaining.length > 0, "pool not emptied");
});

test("#67: ambiguous slab-row guess must not over-prune (bug: commits to column 0)", () => {
  // "Try a wooden slab [3 planks in a row] in the top row"
  const guess = put(empty(), [
    [0, 0, P],
    [0, 1, P],
    [0, 2, P],
  ]);
  const { remaining, colors } = resolveGuess(STICK_SOLUTION, variantsOfStick(), guess);

  // The row is ambiguous: we know 2 planks exist but not their column, so no
  // cell may be pinned green; the two known planks show yellow.
  assertNoGreens(colors);
  const yellows = colors.flat().filter((v) => v === 3).length;
  assert.equal(yellows, 2, `expected exactly 2 yellow, got ${glyph(colors)}`);

  // Critically: every column must still be possible after the trim. The buggy
  // implementation keeps only column 0 (remaining = 2 variants).
  const cols = distinctColumns(remaining);
  assert.ok(cols.size >= 3, `expected variants in all 3 columns, got [${[...cols]}]`);
});

test("#67 follow-up: valid middle-column placement is green after an ambiguous trim", () => {
  const guess1 = put(empty(), [
    [0, 0, P],
    [0, 1, P],
    [0, 2, P],
  ]);
  const first = resolveGuess(STICK_SOLUTION, variantsOfStick(), guess1);

  // [stick, plank, plank] in the MIDDLE column — a perfectly valid solution
  // position. The two planks must be green; the stick (not in the solution)
  // must be uncoloured.
  const guess2 = put(empty(), [
    [0, 1, S],
    [1, 1, P],
    [2, 1, P],
  ]);
  const { colors } = resolveGuess(STICK_SOLUTION, first.remaining, guess2);
  assert.equal(colors[1][1], 2, "middle plank green");
  assert.equal(colors[2][1], 2, "lower plank green");
  assert.equal(colors[0][1], 0, "stick cell uncoloured");
});

test("#67 narrative: three sequential slab rows leave all columns viable", () => {
  let variants = variantsOfStick();
  for (const row of [0, 1, 2]) {
    const guess = empty();
    for (let c = 0; c < 3; c++) guess[row][c] = P;
    const { remaining, colors } = resolveGuess(STICK_SOLUTION, variants, guess);
    variants = remaining;
    assertNoGreens(colors);
    const cols = distinctColumns(variants);
    assert.ok(cols.size >= 3, `after row ${row}: expected all columns viable, got [${[...cols]}]`);
  }
  // after all the ambiguous slab rows, a middle-column placement still works
  const guess = put(empty(), [
    [0, 1, S],
    [1, 1, P],
    [2, 1, P],
  ]);
  const { colors } = resolveGuess(STICK_SOLUTION, variants, guess);
  assert.equal(colors[1][1], 2);
  assert.equal(colors[2][1], 2);
});

test("two planks at the bottom-left also keep all columns viable", () => {
  const guess = put(empty(), [
    [2, 0, P],
    [2, 1, P],
  ]);
  const { remaining, colors } = resolveGuess(STICK_SOLUTION, variantsOfStick(), guess);
  assertNoGreens(colors);
  const yellows = colors.flat().filter((v) => v === 3).length;
  assert.equal(yellows, 2, `expected 2 yellows, got ${glyph(colors)}`);
  const cols = distinctColumns(remaining);
  assert.ok(cols.size >= 3, `expected all columns viable, got [${[...cols]}]`);
});

test("items not in the solution get no colour", () => {
  const guess = put(empty(), [
    [0, 0, COBBLE],
  ]);
  const { colors } = resolveGuess(STICK_SOLUTION, variantsOfStick(), guess);
  assert.equal(colors[0][0], 0, "cobblestone cell must stay uncoloured");
});

test("horizontal recipe: exact row placement is all green", () => {
  const slabSolution = [[P, P, P]];
  const variants = getVariantsWithReflections(slabSolution.map((r) => [...r]));
  const guess = put(empty(), [
    [2, 0, P],
    [2, 1, P],
    [2, 2, P],
  ]);
  const { colors } = resolveGuess(slabSolution, variants, guess);
  assert.deepEqual(colors[2], [2, 2, 2], "bottom row all green");
});

test("compareTables marks air matches (1) and wrong cells (0)", () => {
  const a = [
    [P, null, null],
    [null, null, null],
    [null, null, null],
  ];
  const b = [
    [P, S, null],
    [null, null, null],
    [null, null, null],
  ];
  const [map] = compareTables(a, b);
  assert.equal(map[0][0], 2);
  assert.equal(map[0][1], 0);
  assert.equal(map[0][2], 1);
});
