import { useEffect, useState } from "react";
import Slot from "./Slot.component";
import { useGlobal } from "@/context/Global/context";
import { CACHE_VERSION } from "@/constants";
import MCButton from "./MCButton.component";

export default function Inventory({ guessCount }: { guessCount: number }) {
  const { setCursorItem, craftingTables, setCraftingTables, gameState } =
    useGlobal();
  const [givenIngredients, setGivenIngredients] = useState<string[]>([]);
  const [isTableEmpty, setIsTableEmpty] = useState<boolean>(true);

  useEffect(() => {
    if (craftingTables.length > 0) {
      for (let row of craftingTables[craftingTables.length - 1]) {
        for (let slot of row) {
          if (slot !== undefined && slot !== null) {
            setIsTableEmpty(false);
            return;
          }
        }
      }

      setIsTableEmpty(true);
    }
  }, [craftingTables]);

  useEffect(() => {
    JSON.parse(
      localStorage.getItem(`givenIngredients_${CACHE_VERSION}`) ?? "[]"
    );
    if (givenIngredients.length === 0) {
      fetch("/data/given_ingredients.json")
        .then((response) => response.json())
        .then((obj) => {
          setGivenIngredients(obj);
          localStorage.setItem(
            "givenIngredients",
            JSON.stringify(givenIngredients)
          );
        });
    }
  }, []);

  const clearLastTable = () => {
    setCraftingTables((old) => {
      const newCraftingTables = [...old];
      newCraftingTables.pop();
      newCraftingTables.push([
        [undefined, undefined, undefined],
        [undefined, undefined, undefined],
        [undefined, undefined, undefined],
      ]);
      return newCraftingTables;
    });
    setCursor(undefined);
  };

  const setCursor = (ingredient?: string) => {
    setCursorItem(ingredient);
  };
  return (
    <div
      className="inv-background max-w-[21rem] flex flex-col items-center gap-3"
      onClick={(e: any) => e.stopPropagation()}
    >
      <h2>Crafting Ingredients</h2>
      <div className="flex flex-wrap">
        {givenIngredients.map((ingredient, i) => (
          <Slot
            key={i}
            item={ingredient}
            onClick={() => setCursor(ingredient)}
            clickable
          />
        ))}
      </div>
      <div className="flex w-full justify-between items-center">
        <div className="h-8">
          {gameState === "inprogress" && !isTableEmpty && (
            <MCButton onClick={clearLastTable}>Clear</MCButton>
          )}
        </div>
        <p>Guess {guessCount}/10</p>
      </div>
    </div>
  );
}
