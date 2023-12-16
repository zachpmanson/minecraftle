import CraftingTable from "@/components/CraftingTable.component";
import Cursor from "@/components/Cursor.component";
import Inventory from "@/components/Inventory.component";
import { useGlobal } from "@/context/Global/context";
import { Table } from "@/types";
import { Inter } from "next/font/google";
import { useEffect, useState } from "react";
const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const { craftingTables, setCraftingTables, setCursorItem } = useGlobal();

  const solution = "torch";

  return (
    <div className={`flex max-w-lg flex-col items-center ${inter.className}`}>
      <div id="solutions">
        <div date="2023-12-15" solution="leather_horse_armor"></div>
        <div date="2023-12-14" solution="torch"></div>
        <div date="2023-12-16" solution="oak_sign"></div>
      </div>
      <div className="guesses" id="guesses">
        {craftingTables.map((table, index) => (
          <CraftingTable
            key={index}
            tableNum={index}
            active={index === craftingTables.length - 1}
          />
        ))}
      </div>
      <Inventory guessCount={craftingTables.length} />
      <Cursor />
    </div>
  );
}
