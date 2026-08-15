// Pure crafting-resolver logic for minecraftle, extracted from the React
// context so it can be unit-tested in isolation (src/context/Global/index.tsx).
//
// This module is deliberately self-contained (no imports): it is also loaded
// directly by the test suite via `node --test` with type-stripping, which
// cannot resolve path aliases or extension-less imports.
//
// Color legend (MatchMap): 0 = wrong, 1 = air match, 2 = correct (green),
// 3 = correct item, wrong position (orange/yellow).

export type TableItem = string | undefined | null | number;
export type Row = [TableItem, TableItem, TableItem];
export type Table = [Row, Row, Row];
export type MatchMapRow = [number, number, number];
export type MatchMap = [MatchMapRow, MatchMapRow, MatchMapRow];
export type RawRecipe = (string | null)[][];

function emptyTable(): Table {
  return [
    [null, null, null],
    [null, null, null],
    [null, null, null],
  ];
}

function cloneTable(t: Table): Table {
  return [
    [t[0][0], t[0][1], t[0][2]],
    [t[1][0], t[1][1], t[1][2]],
    [t[2][0], t[2][1], t[2][2]],
  ];
}

export function generateVariants(recipe: RawRecipe): Table[] {
  let height = recipe.length;
  let width = recipe[0].length;
  let verticalVariants = 4 - recipe.length;
  let horizontalVariants = 4 - recipe[0].length;

  let variants = [];

  for (let i = 0; i < verticalVariants; i++) {
    for (let j = 0; j < horizontalVariants; j++) {
      let currentVariant: Table = emptyTable();

      for (let k = 0; k < height; k++) {
        for (let l = 0; l < width; l++) {
          currentVariant[i + k][j + l] = recipe[k][l];
        }
      }
      variants.push(currentVariant);
    }
  }
  return variants;
}

/**
 * All placements of a recipe in a 3x3 grid, plus the reflected placements.
 * Works on a defensive copy — does NOT mutate the input (unlike the original
 * inline implementation in src/context/Global/index.tsx).
 */
export function getVariantsWithReflections(solution: RawRecipe): Table[] {
  let working = solution.map((row) => [...row]);
  let variants = generateVariants(working);
  for (let i = 0; i < working.length; i++) {
    working[i].reverse();
  }
  variants = variants.concat(generateVariants(working));
  return variants;
}

/**
 * Cell-wise comparison of two 3x3 tables. Mutates (coerces undefined -> null)
 * its arguments, mirroring the original behaviour. matchOnly restricts the
 * comparison to cells where BOTH tables equal matchOnly.
 */
export function compareTables(
  table1: Table,
  table2: Table,
  matchOnly?: string | number
): [MatchMap, number, boolean] {
  let matchmap: MatchMap = [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
  ];
  let matchcount = 0;
  let isFullMatch = true;
  for (let i = 0; i < table1.length; i++) {
    for (let j = 0; j < table1[0].length; j++) {
      table1[i][j] = table1[i][j] === undefined ? null : table1[i][j];
      table2[i][j] = table2[i][j] === undefined ? null : table2[i][j];
      if (matchOnly !== undefined) {
        if (table1[i][j] !== matchOnly || table2[i][j] !== matchOnly) {
          continue;
        }
      }

      if (table1[i][j] === table2[i][j]) {
        if (table1[i][j] === null) {
          matchmap[i][j] = 1;
        } else {
          matchmap[i][j] = 2;
          matchcount++;
        }
      } else {
        isFullMatch = false;
      }
    }
  }
  return [matchmap, matchcount, isFullMatch];
}

/**
 * Determines which variants in the pool stay after a guess, plus the green
 * (correct-position) slots. Picks the variant with the highest match count;
 * on ties it arbitrarily takes the FIRST one and keeps only variants whose
 * correct-slot mask is identical to that one's.
 *
 * NOTE (issue #67): this tie-break + over-pruning is buggy. An ambiguous guess
 * that ties across several equally-valid placements commits to the first and
 * silently discards the others, so later guesses in the dropped positions can
 * never be green. The fix belongs here (see tests in test/crafting.test.mjs).
 */
export function findRemainingVariantsIndices(
  matchmaps: MatchMap[],
  matchcounts: number[]
): [number[], MatchMap] {
  let maxMatchesIndex = matchcounts.indexOf(Math.max(...matchcounts));
  let [correctSlots, _, __] = compareTables(
    matchmaps[maxMatchesIndex],
    matchmaps[maxMatchesIndex],
    2
  );

  let remainingVariantsIndices: number[] = [];

  for (let [i, matchmap] of matchmaps.entries()) {
    let matchDataToCompare = compareTables(matchmap, matchmap, 2);
    let correctSlotOverlapData = compareTables(correctSlots, matchDataToCompare[0]);

    if (correctSlotOverlapData[2]) {
      remainingVariantsIndices.push(i);
    }
  }

  return [remainingVariantsIndices, correctSlots];
}

/**
 * Marks orange (3) slots on the given (green-filled) correctSlots map for
 * items known to be in the solution but not yet pinned to a position. Mutates
 * correctSlots in place.
 */
export function addOrangeSlots(
  guess: Table,
  correctSlots: MatchMap,
  solution_n_items: Record<string, number>
) {
  let n_items: Record<string, number> = {};
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (guess[i][j] === null || guess[i][j] === undefined) {
        continue;
      }
      if (n_items[guess[i][j]!] === undefined) {
        n_items[guess[i][j]!] = 0;
      }
    }
  }

  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (guess[i][j] === null || guess[i][j] === undefined) {
        continue;
      }
      if (correctSlots[i][j] === 2) {
        n_items[guess[i][j]!]++;
      }
    }
  }

  let n_unidentified_items = { ...solution_n_items };
  for (let name of Object.keys(n_unidentified_items)) {
    n_unidentified_items[name] -= n_items[name];
  }

  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (guess[i][j] === null || guess[i][j] === undefined) {
        continue;
      }
      if (correctSlots[i][j] !== 2 && n_unidentified_items[guess[i][j]!] > 0) {
        correctSlots[i][j] = 3;
        n_unidentified_items[guess[i][j]!]--;
      }
    }
  }
}

/** Count of each item in the solution recipe. */
export function solutionItemCounts(recipe: RawRecipe): Record<string, number> {
  let counts: Record<string, number> = {};
  for (let i = 0; i < recipe.length; i++) {
    for (let j = 0; j < recipe[0].length; j++) {
      let item = recipe[i][j];
      if (item === null || item === undefined) continue;
      if (counts[item] === undefined) counts[item] = 0;
      counts[item]++;
    }
  }
  return counts;
}

export interface ResolveResult {
  /** The surviving variant pool after the guess. */
  remaining: Table[];
  /** 3x3 colour map: 2 = green, 3 = orange. */
  colors: MatchMap;
}

/**
 * The crafting resolver: given the solution recipe, the current variant pool
 * and a guess, returns the trimmed pool and the colour map for the guess.
 *
 * Mirrors trimVariants() in src/context/Global/index.tsx:
 *   - compare the guess against every remaining variant
 *   - keep the variants consistent with the best match (findRemainingVariantsIndices)
 *   - mark orange for known-but-unplaced items (addOrangeSlots)
 */
export function resolveGuess(
  solutionRecipe: RawRecipe,
  remainingVariants: Table[],
  guess: Table
): ResolveResult {
  let matchmaps: MatchMap[] = [];
  let matchcounts: number[] = [];

  for (let variant of remainingVariants) {
    let matchData = compareTables(cloneTable(variant), cloneTable(guess));
    matchmaps.push(matchData[0]);
    matchcounts.push(matchData[1]);
  }

  let [remainingIndices, correctSlots] = findRemainingVariantsIndices(matchmaps, matchcounts);
  let remaining = remainingVariants.filter((_, i) => remainingIndices.includes(i));

  addOrangeSlots(guess, correctSlots, solutionItemCounts(solutionRecipe));

  return { remaining, colors: correctSlots };
}
