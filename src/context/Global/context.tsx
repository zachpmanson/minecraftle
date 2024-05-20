import { DEFAULT_OPTIONS } from "@/constants";
import {
  ColorTable,
  GameState,
  ItemMap,
  MatchMap,
  Options,
  RecipeMap,
  Table,
  TableItem,
} from "@/types";
import { Dispatch, SetStateAction, createContext, useContext } from "react";

export type GlobalContextProps = {
  userId: string;
  solution: string;
  items: ItemMap;
  cursorItem: TableItem;
  setCursorItem: Dispatch<SetStateAction<TableItem>>;
  craftingTables: Table[];
  setCraftingTables: Dispatch<SetStateAction<Table[]>>;
  colorTables: ColorTable[];
  setColorTables: Dispatch<SetStateAction<ColorTable[]>>;
  recipes: RecipeMap;
  trimVariants: (guess: Table) => MatchMap;
  checkAllVariants: (guess: Table) => string | undefined;
  getFirstSolutionVariant: () => Table;
  gameState: GameState;
  setGameState: Dispatch<SetStateAction<GameState>>;
  options: Options;
  setOptions: Dispatch<SetStateAction<Options>>;
  resetGame: (isRandom: boolean) => void;
  gameDate: Date;
};

const GlobalContext = createContext<GlobalContextProps>({
  userId: "",
  solution: "stick",
  items: {},
  cursorItem: undefined,
  setCursorItem: () => {},
  craftingTables: [],
  setCraftingTables: () => {},
  colorTables: [],
  setColorTables: () => {},
  recipes: {},
  trimVariants: () => [
    [-1, -1, -1],
    [-1, -1, -1],
    [-1, -1, -1],
  ],
  checkAllVariants: () => undefined,
  getFirstSolutionVariant: () => Table,
  gameState: "inprogress",
  setGameState: () => {},
  options: DEFAULT_OPTIONS,
  setOptions: () => {},
  resetGame: () => {},
  gameDate: new Date(),
});

export const GlobalContextProvider = GlobalContext.Provider;

export const useGlobal = () => useContext(GlobalContext);
