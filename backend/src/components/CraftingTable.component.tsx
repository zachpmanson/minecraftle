import { useGlobal } from "@/context/Global/context";
import Slot from "./Slot.component";

export default function CraftingTable({
  active,
  tableNum,
}: {
  active: boolean;
  tableNum: number;
}) {
  const { cursorItem, setCursorItem, setCraftingTables, craftingTables } =
    useGlobal();

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
                backgroundColor={undefined}
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
          item={undefined}
          backgroundColor={undefined}
          clickable={undefined}
          onClick={undefined}
        />
      </div>
    </div>
  );
}
