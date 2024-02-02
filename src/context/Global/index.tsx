import { CACHE_VERSION, DEFAULT_OPTIONS } from "@/constants";
import { compareTables, getVariantsWithReflections } from "@/lib/recipe";
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
import { ReactNode, useEffect, useMemo, useState } from "react";
import seedrandom from "seedrandom";
import { GlobalContextProps, GlobalContextProvider } from "./context";
import { set } from "zod";

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
  const [remainingSolutionVariants, setRemainingSolutionVariants] = useState<
    Table[]
  >([]);
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
      const randomSolution =
        Object.keys(recipes)[
          Math.floor(Math.random() * Object.keys(recipes).length)
        ];
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
      250
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
        newAllRecipesAllVariants[value.output] = getVariantsWithReflections(
          value.input
        );
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

    const randomSolution =
      Object.keys(recipes)[Math.floor(random() * Object.keys(recipes).length)];
    setSolution(randomSolution);
  };

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
    const options = JSON.parse(
      localStorage.getItem(`options`) ?? "{}"
    ) as Options;
    if (Object.keys(options).length === 0) {
      setOptions(DEFAULT_OPTIONS);
    } else {
      setOptions(options);
    }
  };

  const getItems = () => {
    const itemMap = JSON.parse(
      localStorage.getItem(`items_${CACHE_VERSION}`) ?? "{}"
    ) as ItemMap;

    if (Object.keys(itemMap).length === 0) {
      fetch("/data/items.json", {
        headers: {
          "Content-Type": "application/json",
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
    const recipeMap = JSON.parse(
      localStorage.getItem(`recipes_${CACHE_VERSION}`) ?? "{}"
    ) as RecipeMap;

    if (Object.keys(recipeMap).length === 0) {
      fetch("/data/recipes.json", {
        headers: {
          "Content-Type": "application/json",
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

  const trimVariants = (guess: Table) => {
    let [matchmaps, matchcounts] = checkRemainingSolutionVariants(guess);
    // find remaining variants, correctSlots only has green slots
    let [remainingVariantsIndices, correctSlots] = findRemainingVariantsIndices(
      matchmaps,
      matchcounts
    );

    setRemainingSolutionVariants((old) =>
      [...old].filter((_, i) => remainingVariantsIndices.includes(i))
    );

    // add orange slots to correctSlots
    addOrangeSlots(guess, correctSlots);

    return correctSlots;
  };

  const checkRemainingSolutionVariants = (
    guess: Table
  ): [MatchMap[], number[]] => {
    let matchmaps: MatchMap[] = [];
    let matchcounts: number[] = [];

    for (let variant of remainingSolutionVariants) {
      let matchData = compareTables(variant, guess);

      matchmaps.push(matchData[0]);
      matchcounts.push(matchData[1]);
    }

    return [matchmaps, matchcounts];
  };

  /**
   * Determines which variants in remainingVariants will stay.  Chooses variant
   * with highest number of matches.  If multiple of these, picks one and only
   * keeps variants with matching correct slots as the chosen one.
   * @param {Array} matchmaps
   * @param {Array} matchcounts
   * @returns
   */
  function findRemainingVariantsIndices(
    matchmaps: MatchMap[],
    matchcounts: number[]
  ): [number[], MatchMap] {
    // Get index of max value in matchcounts
    let maxMatchesIndex = matchcounts.indexOf(Math.max(...matchcounts));
    // generate mask matchmap at this index for 2's
    let [correctSlots, _, __] = compareTables(
      matchmaps[maxMatchesIndex],
      matchmaps[maxMatchesIndex],
      2
    );

    let remainingVariantsIndices: number[] = [];

    for (let [i, matchmap] of matchmaps.entries()) {
      // mask to only include 2's in matchmaps
      let matchDataToCompare = compareTables(matchmap, matchmap, 2);
      // compare masked
      let correctSlotOverlapData = compareTables(
        correctSlots,
        matchDataToCompare[0]
      );

      // if correctSlotOverlapData is full match
      if (correctSlotOverlapData[2]) {
        remainingVariantsIndices.push(i);
      }
    }

    return [remainingVariantsIndices, correctSlots];
  }

  /**
   * Adds orange slots to a given table.  Requires all correctSlots to already be
   * filled in.
   * @param {Array} guess
   * @param {Array} correctSlots
   */
  function addOrangeSlots(guess: Table, correctSlots: MatchMap) {
    let n_items: { [key: string]: number } = {};
    // first pass initiliases all item dict entries to 0
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

    // Second pass counts how many of each item are correct
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

    // finds how many of each item are left to be identified
    let n_unidentified_items = { ...solution_n_items };
    for (let name of Object.keys(n_unidentified_items)) {
      n_unidentified_items[name] -= n_items[name];
    }

    // final pass marks (at most n) orange slots for each item in n_unidentified_items
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (guess[i][j] === null || guess[i][j] === undefined) {
          continue;
        }

        if (
          correctSlots[i][j] !== 2 &&
          n_unidentified_items[guess[i][j]!] > 0
        ) {
          correctSlots[i][j] = 3;
          n_unidentified_items[guess[i][j]!]--;
        }
      }
    }
  }

  const value: GlobalContextProps = useMemo(
    () => ({
      userId,
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
      trimVariants,
      gameState,
      setGameState,
      options,
      setOptions,
      resetGame,
      gameDate,
    }),
    [
      userId,
      solution,
      items,
      cursorItem,
      setCursorItem,
      craftingTables,
      setCraftingTables,
      recipes,
      checkAllVariants,
      trimVariants,
      colorTables,
      setColorTables,
      gameState,
      setGameState,
      options,
      setOptions,
      resetGame,
      gameDate,
    ]
  );

  return (
    <GlobalContextProvider value={value}>{children}</GlobalContextProvider>
  );
};

export default GlobalProvider;
