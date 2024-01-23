import { MatchMap, RawRecipe, Table } from "@/types";

export function getVariantsWithReflections(solution: RawRecipe): Table[] {
  let variants = generateVariants(solution);
  for (let i = 0; i < solution.length; i++) {
    solution[i].reverse();
  }
  variants = variants.concat(generateVariants(solution));
  return variants;
}

function generateVariants(recipe: RawRecipe): Table[] {
  let height = recipe.length;
  let width = recipe[0].length;
  let verticalVariants = 4 - recipe.length;
  let horizontalVariants = 4 - recipe[0].length;

  let variants = [];

  for (let i = 0; i < verticalVariants; i++) {
    for (let j = 0; j < horizontalVariants; j++) {
      let currentVariant: Table = [
        [null, null, null],
        [null, null, null],
        [null, null, null],
      ];

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

export function compareTables(
  table1: Table,
  table2: Table,
  matchOnly?: string | number
): [MatchMap, number, boolean] {
  // console.log("compareTables", table1, table2);
  // 0 is wrong, 1 is null match, 2 is item match
  let matchmap: MatchMap = [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
  ];
  let matchcount = 0;
  let isFullMatch = true;
  for (let i = 0; i < table1.length; i++) {
    for (let j = 0; j < table1[0].length; j++) {
      // coerce to null
      table1[i][j] = table1[i][j] === undefined ? null : table1[i][j];
      table2[i][j] = table2[i][j] === undefined ? null : table2[i][j];
      // if matchOnly arg given
      if (matchOnly !== undefined) {
        // if either do not match matchOnly
        if (table1[i][j] !== matchOnly || table2[i][j] !== matchOnly) {
          // leave matchmap entry as incorrect
          continue;
        }
      }

      if (table1[i][j] === table2[i][j]) {
        if (table1[i][j] === null) {
          // if match is air
          matchmap[i][j] = 1;
        } else {
          // if match is item
          matchmap[i][j] = 2;
          matchcount++;
        }
      } else {
        isFullMatch = false;
      }
    }
  }

  // console.log([matchmap, matchcount, isFullMatch]);
  return [matchmap, matchcount, isFullMatch];
}
