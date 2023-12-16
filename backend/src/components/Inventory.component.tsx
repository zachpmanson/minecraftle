import { useEffect, useState } from "react";
import Slot from "./Slot.component";
import { useGlobal } from "@/context/Global/context";

export default function Inventory({ guessCount }: { guessCount: number }) {
  const { setCursorItem } = useGlobal();
  const [givenIngredients, setGivenIngredients] = useState<string[]>([]);

  useEffect(() => {
    JSON.parse(localStorage.getItem("givenIngredients") ?? "[]");
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
      <p>Guess {guessCount}/10</p>
    </div>
  );
}
