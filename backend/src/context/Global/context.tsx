import { ItemMap, MatchMap, RecipeMap, Table, TableItem } from "@/types";
import { Dispatch, SetStateAction, createContext, useContext } from "react";

export type GlobalContextProps = {
  solution: string;
  items: ItemMap;
  cursorItem: TableItem;
  setCursorItem: Dispatch<SetStateAction<TableItem>>;
  craftingTables: Table[];
  setCraftingTables: Dispatch<SetStateAction<Table[]>>;
  recipes: RecipeMap;
  trimVariants: (guess: Table) => MatchMap;
  checkAllVariants: (guess: Table) => string | undefined;
};

const GlobalContext = createContext<GlobalContextProps>({
  solution: "stick",
  items: {},
  cursorItem: undefined,
  setCursorItem: () => {},
  craftingTables: [],
  setCraftingTables: () => {},
  recipes: {},
  trimVariants: () => [
    [-1, -1, -1],
    [-1, -1, -1],
    [-1, -1, -1],
  ],
  checkAllVariants: () => undefined,
});

export const GlobalContextProvider = GlobalContext.Provider;

export const useGlobal = () => useContext(GlobalContext);
