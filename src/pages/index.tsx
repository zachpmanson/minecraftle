import CraftingTable from "@/components/CraftingTable.component";
import Cursor from "@/components/Cursor.component";
import Inventory from "@/components/Inventory.component";
import LoadingSpinner from "@/components/LoadingSpinner.component";
import MCButton from "@/components/MCButton.component";
import Popup from "@/components/Popup.component";
import { useGlobal } from "@/context/Global/context";
import { Inter } from "next/font/google";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const router = useRouter();
  const { random } = router.query;
  const { craftingTables, gameState, userId, resetGame, recipes } = useGlobal();
  const [popupVisible, setPopupVisible] = useState(false);

  const divRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    divRef?.current?.scrollIntoView({ behavior: "smooth" });
  }, [craftingTables.length]);

  useEffect(() => {
    if (random) {
      resetGame(true);
      setPopupVisible(false);
    }
  }, [random]);

  useEffect(() => {
    if (gameState === "won") {
      setPopupVisible(true);
      fetch("/api/submitgame", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: userId,
          attempts: craftingTables.length,
          date: new Date().toISOString(), // TODO make this based on the start time
        }),
      }).then(() => {});
    } else if (gameState === "lost") {
      setPopupVisible(true);
      fetch("/api/submitgame", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: userId,
          attempts: 11,
          date: new Date().toISOString(), // make this based on the start time
        }),
      }).then((res) => {});
    }
  }, [gameState]);

  return (
    <div className={`flex max-w-lg flex-col items-center ${inter.className}`}>
      <Cursor />

      {Object.keys(recipes).length > 0 ? (
        <div className="guesses" id="guesses">
          {craftingTables.map((table, index) => (
            <CraftingTable
              key={index}
              tableNum={index}
              active={
                index === craftingTables.length - 1 &&
                gameState === "inprogress"
              }
            />
          ))}
        </div>
      ) : (
        <div className="inv-background">
          <LoadingSpinner />
        </div>
      )}

      <Inventory guessCount={craftingTables.length} />
      <div ref={divRef}></div>
      {popupVisible && (
        <Popup
          isRandom={!!random}
          isOpen={popupVisible}
          closeModal={() => {
            setPopupVisible(false);
          }}
        />
      )}
      {gameState !== "inprogress" && (
        <MCButton onClick={() => setPopupVisible(true)}>Show Summary</MCButton>
      )}
    </div>
  );
}
