import CraftingTable from "@/components/CraftingTable.component";
import Cursor from "@/components/Cursor.component";
import Inventory from "@/components/Inventory.component";
import { useGlobal } from "@/context/Global/context";
import { Inter } from "next/font/google";
import Head from "next/head";
import { useEffect, useRef } from "react";
const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const { craftingTables } = useGlobal();
  const divRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    divRef?.current?.scrollIntoView({ behavior: "smooth" });
  }, [craftingTables.length]);

  return (
    <div className={`flex max-w-lg flex-col items-center ${inter.className}`}>
      <Head>
        <title>Minecraftle</title>
      </Head>
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
      <div ref={divRef}></div>
      <Cursor />
    </div>
  );
}
