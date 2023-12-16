import { getVariantsWithReflections } from "@/lib/recipe";
import { ItemMap, RecipeMap, Table, TableItem } from "@/types";
import { ReactNode, useEffect, useMemo, useState } from "react";
import { GlobalContextProps, GlobalContextProvider } from "./context";

const GlobalProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<ItemMap>({});
  const [cursorItem, setCursorItem] = useState<string | undefined>(undefined);
  const [craftingTables, setCraftingTables] = useState<Table[]>([
    [
      [undefined, undefined, undefined],
      [undefined, undefined, undefined],
      [undefined, undefined, undefined],
    ],
  ]);
  const [recipes, setRecipes] = useState<RecipeMap>({});
  const [solution, setSolution] = useState<TableItem>(undefined);
  const [allRecipesAllVariants, setAllRecipesAllVariants] = useState<{
    [key: string]: Table[];
  }>({});

  useEffect(() => {
    getItems();
    getRecipes();
  }, []);

  useEffect(() => {
    for (let [key, value] of Object.entries(recipes)) {
      setAllRecipesAllVariants((old) => {
        let newAllRecipesAllVariants = { ...old };
        newAllRecipesAllVariants[value.output] = getVariantsWithReflections(
          value.input
        );
        return newAllRecipesAllVariants;
      });
    }
    console.log(allRecipesAllVariants);
  }, [recipes]);

  const getItems = () => {
    const itemMap = JSON.parse(
      localStorage.getItem("items") ?? "{}"
    ) as ItemMap;

    if (Object.keys(itemMap).length === 0) {
      fetch("/data/items.json", {
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((res) => res.json())
        .then((res) => setItems(res));
    } else {
      setItems(itemMap);
    }
  };

  const getRecipes = () => {
    const recipeMap = JSON.parse(
      localStorage.getItem("items") ?? "{}"
    ) as RecipeMap;

    if (Object.keys(recipeMap).length === 0) {
      fetch("/data/recipes.json", {
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((res) => res.json())
        .then((res) => setRecipes(res));
    } else {
      setRecipes(recipeMap);
    }
  };

  const value: GlobalContextProps = useMemo(
    () => ({
      items,
      cursorItem,
      setCursorItem,
      craftingTables,
      setCraftingTables,
      recipes,
    }),
    [
      items,
      cursorItem,
      setCursorItem,
      craftingTables,
      setCraftingTables,
      recipes,
    ]
  );

  return (
    <GlobalContextProvider value={value}>{children}</GlobalContextProvider>
  );
};

export default GlobalProvider;
