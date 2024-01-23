import { z } from "zod";

export type GenericApiError = {
  error: string | z.ZodError<any>;
  details?: any;
};

export type TableItem = string | undefined | null | number;
export type Row = [TableItem, TableItem, TableItem];
export type Table = [Row, Row, Row];

export type Color = number | undefined;
export type ColorRow = [Color, Color, Color];
export type ColorTable = [ColorRow, ColorRow, ColorRow];

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

export type MatchMapRow = [number, number, number];
export type MatchMap = [MatchMapRow, MatchMapRow, MatchMapRow];

export type GameState = "inprogress" | "won" | "lost";

export type Options = {
  highContrast: boolean;
};

export type ScoreboardRow = {
  user_id: string | null;
  dense_rank_number: number;
  total_games: number;
  total_win_attempts: number;
  total_losses: number;
  total_1: number;
  total_2: number;
  total_3: number;
  total_4: number;
  total_5: number;
  total_6: number;
  total_7: number;
  total_8: number;
  total_9: number;
  total_10: number;
};
