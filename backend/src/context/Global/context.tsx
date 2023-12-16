import { ItemMap, RecipeMap, Table, TableItem } from "@/types";
import { Dispatch, SetStateAction, createContext, useContext } from "react";

export type GlobalContextProps = {
  items: ItemMap;
  cursorItem: string | undefined;
  setCursorItem: Dispatch<SetStateAction<TableItem>>;
  craftingTables: Table[];
  setCraftingTables: Dispatch<SetStateAction<Table[]>>;
  recipes: RecipeMap;
};

const GlobalContext = createContext<GlobalContextProps>({
  items: {},
  cursorItem: undefined,
  setCursorItem: () => {},
  craftingTables: [],
  setCraftingTables: () => {},
  recipes: {},
});

export const GlobalContextProvider = GlobalContext.Provider;

export const useGlobal = () => useContext(GlobalContext);
