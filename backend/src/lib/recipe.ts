import { RawRecipe, Table } from "@/types";

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
