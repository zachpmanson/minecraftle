import { useGlobal } from "@/context/Global/context";
import Slot from "./Slot.component";
import { useEffect, useState } from "react";
import { FAILURE_COLOR, SUCCESS_COLOR } from "@/constants";

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
  } = useGlobal();

  const [currentRecipe, setCurrentRecipe] = useState<string | undefined>();
  const [colorTable, setColorTable] = useState<(string | undefined)[][]>([
    [undefined, undefined, undefined],
    [undefined, undefined, undefined],
    [undefined, undefined, undefined],
  ]);

  useEffect(() => {
    if (active) {
      // check if recipe matches ANY valid recipe
      const result = checkAllVariants(craftingTables[tableNum]);
      console.log("result", result);
      setCurrentRecipe(result);
    }
  }, [craftingTables]);

  const clickSlot = (row: number, col: number) => {
    let oldCursorItem = cursorItem;
    let oldCraftingTable = craftingTables[tableNum][row][col];

    setCraftingTables((old) => {
      const newCraftingTables = [...old];
      newCraftingTables[tableNum][row][col] = oldCursorItem;
      return newCraftingTables;
    });
    setCursorItem(oldCraftingTable);
  };

  const processGuess = () => {
    if (currentRecipe?.replace("minecraft:", "") === solution) {
      setColorTable([
        [SUCCESS_COLOR, SUCCESS_COLOR, SUCCESS_COLOR],
        [SUCCESS_COLOR, SUCCESS_COLOR, SUCCESS_COLOR],
        [SUCCESS_COLOR, SUCCESS_COLOR, SUCCESS_COLOR],
      ]);
      return;
    }

    // is wrong, trim the remaining solution variants
    const correctSlots = trimVariants(craftingTables[tableNum]);

    const COLOR_MAP: { [key: number]: string | undefined } = {
      0: undefined,
      2: SUCCESS_COLOR,
      3: FAILURE_COLOR,
    };

    // update colors based on matchmap
    setColorTable([
      [
        COLOR_MAP[correctSlots[0][0]],
        COLOR_MAP[correctSlots[0][1]],
        COLOR_MAP[correctSlots[0][2]],
      ],
      [
        COLOR_MAP[correctSlots[1][0]],
        COLOR_MAP[correctSlots[1][1]],
        COLOR_MAP[correctSlots[1][2]],
      ],
      [
        COLOR_MAP[correctSlots[2][0]],
        COLOR_MAP[correctSlots[2][1]],
        COLOR_MAP[correctSlots[2][2]],
      ],
    ]);

    setCraftingTables((old) => {
      const newCraftingTables = [...old];
      newCraftingTables.push([
        [undefined, undefined, undefined],
        [undefined, undefined, undefined],
        [undefined, undefined, undefined],
      ]);
      return newCraftingTables;
    });
  };

  return (
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
                backgroundColor={colorTable[rowIndex][columnIndex]}
                clickable={active}
                onClick={() => clickSlot(rowIndex, columnIndex)}
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
  );
}
