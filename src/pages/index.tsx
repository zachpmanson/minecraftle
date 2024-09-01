import CraftingTable from "@/components/CraftingTable.component";
import Cursor from "@/components/Cursor.component";
import Inventory from "@/components/Inventory.component";
import LoadingSpinner from "@/components/LoadingSpinner.component";
import MCButton from "@/components/MCButton.component";
import Popup from "@/components/Popup.component";
import { useGlobal } from "@/context/Global/context";
import { trpc } from "@/utils/trpc";
import { Inter } from "next/font/google";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const router = useRouter();
  const { random } = router.query;
  const {
    craftingTables,
    gameState,
    userId,
    resetGame,
    recipes,
    gameDate,
    items,
  } = useGlobal();
  const [popupVisible, setPopupVisible] = useState(false);

  const submitGame = trpc.game.submitGame.useMutation();

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
    if (gameState === "inprogress") return;

    setPopupVisible(true);

    if (
      localStorage.getItem("lastGameDate") !== gameDate.toDateString() &&
      !random
    ) {
      submitGame
        .mutateAsync({
          user_id: userId,
          attempts: gameState === "won" ? craftingTables.length : 11,
          date: gameDate.toISOString(), // TODO make this based on the start time
        })
        .then((res) => {
          localStorage.setItem("lastGameDate", gameDate.toDateString());
        });
    }
  }, [gameState]);

  return (
    <div
      className={`flex max-w-lg flex-col items-center m-auto ${inter.className}`}
    >
      <Cursor />

      {Object.keys(recipes).length > 0 && Object.keys(items).length > 0 ? (
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
        <div className="box inv-background">
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
