import { COLORS, HICONTRAST_COLORS } from "@/constants";
import { useGlobal } from "@/context/Global/context";
import { ColorTable } from "@/types";
import { useEffect, useState } from "react";
import Slot from "./Slot.component";

export default function CraftingTable({
  active,
  tableNum,
}: {
  active: boolean;
  tableNum: number;
}) {
  const {
    cursorItem,
    setCursorItem,
    setCraftingTables,
    craftingTables,
    checkAllVariants,
    solution,
    trimVariants,
    colorTables,
    setColorTables,
    setGameState,
    options: { highContrast },
    recipes,
  } = useGlobal();

  const [currentRecipe, setCurrentRecipe] = useState<string | undefined>();
  const colorTable = colorTables[tableNum];

  const [isDown, setIsDown] = useState(false); // TODO: remove this
  const [isDragging, setIsDragging] = useState(false);

  const { SUCCESS_COLOR, NEAR_SUCCESS_COLOR } = highContrast
    ? HICONTRAST_COLORS
    : COLORS;

  const COLOR_MAP: { [key: number]: string | undefined } = {
    0: undefined,
    2: SUCCESS_COLOR,
    3: NEAR_SUCCESS_COLOR,
  };

  useEffect(() => {
    if (craftingTables[tableNum]) {
      for (let row of craftingTables[tableNum]) {
        for (let item of row) {
          if (item) {
            return;
          }
        }
      }
    }
    setCurrentRecipe(undefined);
  }, [craftingTables]);

  const onMouseDown = (row: number, col: number) => {
    if (!!cursorItem) {
      setIsDown(true);
      document.addEventListener("mouseup", () => {
        setIsDown(false);
        const result = checkAllVariants(craftingTables[tableNum]);
        setCurrentRecipe(result);
      });
    }
  };

  const onMouseUp = (row: number, col: number) => {
    let oldCursorItem = cursorItem;
    let oldCraftingTable = craftingTables[tableNum][row][col];

    setIsDown(false);
    if (isDragging) {
      setCursorItem(undefined);
      setIsDragging(false);
    } else {
      setCraftingTables((old) => {
        const newCraftingTables = [...old];
        newCraftingTables[tableNum][row][col] = oldCursorItem;
        return newCraftingTables;
      });
      setCursorItem(oldCraftingTable);
    }
    const result = checkAllVariants(craftingTables[tableNum]);
    setCurrentRecipe(result);
  };

  const onMouseMove = (row: number, col: number) => {
    if (isDown && !craftingTables[tableNum][row][col]) {
      setIsDragging(true);
      setCraftingTables((old) => {
        const newCraftingTables = [...old];
        newCraftingTables[tableNum][row][col] = cursorItem;
        return newCraftingTables;
      });
    }
  };

  const setColorTable = (t: ColorTable) => {
    setColorTables((o) => {
      let n = [...o];
      n[tableNum] = t;
      return n;
    });
  };

  const processGuess = () => {
    if (currentRecipe?.replace("minecraft:", "") === solution) {
      setColorTable([
        [2, 2, 2],
        [2, 2, 2],
        [2, 2, 2],
      ]);
      setTimeout(() => {
        setGameState("won");
      }, 1000);
      return;
    }

    // is wrong, trim the remaining solution variants
    const correctSlots = trimVariants(craftingTables[tableNum]);

    // update colors based on matchmap
    setColorTable(correctSlots);

    if (craftingTables.length < 10) {
      setCraftingTables((old) => {
        const newCraftingTables = [...old];
        newCraftingTables.push([
          [undefined, undefined, undefined],
          [undefined, undefined, undefined],
          [undefined, undefined, undefined],
        ]);
        return newCraftingTables;
      });
      setColorTables((old) => {
        const newColorTables = [...old];
        newColorTables.push([
          [undefined, undefined, undefined],
          [undefined, undefined, undefined],
          [undefined, undefined, undefined],
        ]);
        return newColorTables;
      });
    } else {
      setTimeout(() => {
        setGameState("lost");
      }, 1000);
    }
  };

  return (
    <>
      <div
        className="flex inv-background justify-between items-center w-[22rem]"
        onClick={(e: any) => e.stopPropagation()}
      >
        <div className="w-36 h-36 flex flex-wrap">
          {craftingTables[tableNum].map((row, rowIndex) => (
            <div className="flex" key={rowIndex}>
              {row.map((item, columnIndex) => (
                <Slot
                  key={`${rowIndex}-${columnIndex}`}
                  item={item}
                  backgroundColor={
                    COLOR_MAP[colorTable[rowIndex][columnIndex] ?? 0]
                  }
                  clickable={active}
                  onMouseDown={() => onMouseDown(rowIndex, columnIndex)}
                  onMouseUp={() => onMouseUp(rowIndex, columnIndex)}
                  onMouseMove={() => onMouseMove(rowIndex, columnIndex)}
                />
              ))}
            </div>
          ))}
        </div>

        <p className="text-5xl m-4 text-slot-background">→</p>
        <div className="crafting-output">
          <Slot
            item={currentRecipe}
            backgroundColor={undefined}
            clickable={active && !!currentRecipe}
            onClick={processGuess}
          />
        </div>
      </div>
    </>
  );
}
