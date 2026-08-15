import { CACHE_VERSION, DEFAULT_OPTIONS, PUBLIC_DIR } from "@/constants";
import { ColorTable, GameState, ItemMap, MatchMap, Options, RecipeMap, Table, TableItem } from "@/types";
import { compareTables, getVariantsWithReflections } from "@/utils/recipe";
import { resolveGuess } from "@/utils/crafting";
import { ReactNode, useEffect, useMemo, useState } from "react";
import seedrandom from "seedrandom";
import { GlobalContextProps, GlobalContextProvider } from "./context";

const GlobalProvider = ({ children }: { children: ReactNode }) => {
  const [userId, setUserId] = useState<string>("");
  const [options, setOptions] = useState<Options>(DEFAULT_OPTIONS); // ["stick", "planks", "wood"

  const [gameDate, setGameDate] = useState(new Date());
  const [gameState, setGameState] = useState<GameState>("inprogress");
  const [solution, setSolution] = useState<string>("stick");
  const [items, setItems] = useState<ItemMap>({});
  const [cursorItem, setCursorItem] = useState<TableItem>(undefined);
  const [craftingTables, setCraftingTables] = useState<Table[]>([
    [
      [undefined, undefined, undefined],
      [undefined, undefined, undefined],
      [undefined, undefined, undefined],
    ],
  ]);
  const [colorTables, setColorTables] = useState<ColorTable[]>([
    [
      [undefined, undefined, undefined],
      [undefined, undefined, undefined],
      [undefined, undefined, undefined],
    ],
  ]);

  const [recipes, setRecipes] = useState<RecipeMap>({});
  const [solutionRecipe, setSolutionRecipe] = useState<(string | null)[][]>([]);
  const [allRecipesAllVariants, setAllRecipesAllVariants] = useState<{
    [key: string]: Table[];
  }>({});
  const [allSolutionVariants, setAllSolutionVariants] = useState<Table[]>([]);
  const [remainingSolutionVariants, setRemainingSolutionVariants] = useState<Table[]>([]);
  const [solution_n_items, setSolution_n_items] = useState<{
    [key: string]: number;
  }>({});

  useEffect(() => {
    getUserId();
    getOptions();
    getItems();
    getRecipes();
  }, []);

  const resetGame = (isRandom: boolean) => {
    setGameState("inprogress");
    if (isRandom) {
      const randomSolution = Object.keys(recipes)[Math.floor(Math.random() * Object.keys(recipes).length)];
      setSolution(randomSolution);
    } else {
      const newDate = new Date();
      setGameDate(newDate);
      generateSetPuzzle(newDate);
    }

    setCursorItem(undefined);
    setCraftingTables([]);
    setTimeout(
      () =>
        setCraftingTables([
          [
            [undefined, undefined, undefined],
            [undefined, undefined, undefined],
            [undefined, undefined, undefined],
          ],
        ]),
      250,
    );
    setColorTables([
      [
        [undefined, undefined, undefined],
        [undefined, undefined, undefined],
        [undefined, undefined, undefined],
      ],
    ]);
  };

  useEffect(() => {
    if (Object.keys(recipes).length > 0) {
      // load all item recipes with all variants
      let newAllRecipesAllVariants = { ...allRecipesAllVariants };
      for (let [key, value] of Object.entries(recipes)) {
        newAllRecipesAllVariants[value.output] = getVariantsWithReflections(value.input);
      }
      setAllRecipesAllVariants(newAllRecipesAllVariants);
      if (solution) {
        setSolutionRecipe(recipes[solution].input);
      }
    }
  }, [recipes, solution]);

  useEffect(() => {
    if (solutionRecipe.length > 0) {
      // generate all solution variants based on initial soln recipe
      let newSolution_n_items: { [key: string]: number } = {};
      for (let i = 0; i < solutionRecipe.length; i++) {
        for (let j = 0; j < solutionRecipe[0].length; j++) {
          if (solutionRecipe[i][j] === null) {
            continue;
          }
          if (newSolution_n_items[solutionRecipe[i][j]!] === undefined) {
            newSolution_n_items[solutionRecipe[i][j]!] = 1;
          } else {
            newSolution_n_items[solutionRecipe[i][j]!]++;
          }
        }
      }
      setSolution_n_items(newSolution_n_items);

      // include reflections
      let solutionVariants = getVariantsWithReflections(solutionRecipe);
      setAllSolutionVariants(solutionVariants);
      setRemainingSolutionVariants(solutionVariants);
    }
  }, [solutionRecipe]);

  useEffect(() => {
    generateSetPuzzle(gameDate);
  }, [recipes]);

  const generateSetPuzzle = (date: Date) => {
    const random = seedrandom(date.toDateString());

    const randomSolution = Object.keys(recipes)[Math.floor(random() * Object.keys(recipes).length)];
    setSolution(randomSolution);
  };

  // Dev/test hook: lets you force the puzzle's correct answer from the JS
  // console via `window.minecraftle` (e.g. to interactively test hint
  // behaviour with specific recipes).
  useEffect(() => {
    const emptyTable = (): Table => [
      [undefined, undefined, undefined],
      [undefined, undefined, undefined],
      [undefined, undefined, undefined],
    ];
    const emptyColors = (): ColorTable => [
      [undefined, undefined, undefined],
      [undefined, undefined, undefined],
      [undefined, undefined, undefined],
    ];

    const api = {
      /** Set the solution to a known recipe key, e.g. setSolution("stick"). */
      setSolution: (name: string) => {
        if (!recipes[name]) {
          console.warn(`[minecraftle] unknown recipe key "${name}". Keys:`, Object.keys(recipes));
          return;
        }
        setGameState("inprogress");
        setSolution(name);
        setCursorItem(undefined);
        setCraftingTables([emptyTable()]);
        setColorTables([emptyColors()]);
        console.log(`[minecraftle] solution set to "${name}"`, recipes[name].input);
      },
      /** Set a custom solution recipe (grid of item ids), e.g.
       *  setCustomSolution([["minecraft:planks"],["minecraft:planks"]]).
       *  Note: the win check compares against recipes[solution].output, so a
       *  custom answer won't trigger the "won" screen — it's for testing
       *  hint colours.
       */
      setCustomSolution: (input: (string | null)[][]) => {
        if (!Array.isArray(input) || input.length === 0) {
          console.warn("[minecraftle] setCustomSolution expects a non-empty array of rows");
          return;
        }
        setGameState("inprogress");
        setSolutionRecipe(input);
        setCursorItem(undefined);
        setCraftingTables([emptyTable()]);
        setColorTables([emptyColors()]);
        console.log("[minecraftle] custom solution set:", input);
      },
      reset: (isRandom: boolean = false) => resetGame(isRandom),
      getState: () => ({
        solution,
        solutionVariantsLeft: remainingSolutionVariants.length,
      }),
    };

    (window as unknown as { minecraftle?: typeof api }).minecraftle = api;
    return () => {
      delete (window as unknown as { minecraftle?: typeof api }).minecraftle;
    };
  }, [recipes, solution, remainingSolutionVariants, resetGame]);

  const getUserId = () => {
    let user_id = localStorage.getItem("user_id");

    if (user_id === null) {
      user_id = Date.now().toString() + Math.random().toString(); //self.crypto.randomUUID();// crypto only works with SSL
      localStorage.setItem("user_id", user_id);
    }

    setUserId(user_id);
  };

  useEffect(() => {
    localStorage.setItem(`options`, JSON.stringify(options));
  }, [options]);

  const getOptions = () => {
    const options = JSON.parse(localStorage.getItem(`options`) ?? "{}") as Options;
    if (Object.keys(options).length === 0) {
      setOptions(DEFAULT_OPTIONS);
    } else {
      setOptions(options);
    }
  };

  const getItems = () => {
    const itemMap = JSON.parse(localStorage.getItem(`items_${CACHE_VERSION}`) ?? "{}") as ItemMap;

    if (Object.keys(itemMap).length === 0) {
      fetch(PUBLIC_DIR + "/data/items.json", {
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache",
        },
      })
        .then((res) => res.json())
        .then((res) => {
          setItems(res);
          localStorage.setItem(`items_${CACHE_VERSION}`, JSON.stringify(res));
        });
    } else {
      setItems(itemMap);
    }
  };

  const getRecipes = () => {
    const recipeMap = JSON.parse(localStorage.getItem(`recipes_${CACHE_VERSION}`) ?? "{}") as RecipeMap;

    if (Object.keys(recipeMap).length === 0) {
      fetch(PUBLIC_DIR + "/data/recipes.json", {
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache",
        },
      })
        .then((res) => res.json())
        .then((res) => {
          setRecipes(res);
          localStorage.setItem(`recipes_${CACHE_VERSION}`, JSON.stringify(res));
        });
    } else {
      setRecipes(recipeMap);
    }
  };

  /**
   * Compares a guess to all recipes and returns the first match
   * @param guess Table
   * @returns first match name or undefined
   */
  const checkAllVariants = (guess: Table): string | undefined => {
    for (let [key, recipe] of Object.entries(allRecipesAllVariants)) {
      for (let variant of recipe) {
        let [mm, matchcount, isFullMatch] = compareTables(variant, guess);
        // matchData[2] is boolean isFullMatch
        if (isFullMatch) {
          return key;
        }
      }
    }
    return undefined;
  };

  const getFirstSolutionVariant = (): Table => {
    return remainingSolutionVariants[0];
  };

  const trimVariants = (guess: Table) => {
    // pure crafting resolver: trims the variant pool + computes green/orange
    const { remaining, colors } = resolveGuess(solutionRecipe, remainingSolutionVariants, guess);

    setRemainingSolutionVariants(remaining);

    return colors;
  };

  const value: GlobalContextProps = useMemo(
    () => ({
      userId,
      setUserId,
      solution,
      items,
      cursorItem,
      setCursorItem,
      craftingTables,
      setCraftingTables,
      colorTables,
      setColorTables,
      recipes,
      checkAllVariants,
      getFirstSolutionVariant,
      trimVariants,
      gameState,
      setGameState,
      options,
      setOptions,
      resetGame,
      gameDate,
      remainingSolutionVariants,
    }),
    [
      userId,
      setUserId,
      solution,
      items,
      cursorItem,
      setCursorItem,
      craftingTables,
      setCraftingTables,
      recipes,
      checkAllVariants,
      getFirstSolutionVariant,
      trimVariants,
      colorTables,
      setColorTables,
      gameState,
      setGameState,
      options,
      setOptions,
      resetGame,
      gameDate,
      remainingSolutionVariants,
    ],
  );

  return <GlobalContextProvider value={value}>{children}</GlobalContextProvider>;
};

export default GlobalProvider;
