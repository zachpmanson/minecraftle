import { z } from "zod";

export type GenericApiError = { error: string | z.ZodError<any> };

export type TableItem = string | undefined | null;
export type Row = [TableItem, TableItem, TableItem];
export type Table = [Row, Row, Row];

export type Item = {
  name: string;
  icon: string;
  stack: number;
};
export type ItemMap = { [key: string]: Item };

export type RawRecipe = (string | null)[][];

export type Recipe = {
  type: string;
  group: string;
  output: string;
  input: RawRecipe;
};

export type RecipeMap = {
  [key: string]: Recipe;
};
