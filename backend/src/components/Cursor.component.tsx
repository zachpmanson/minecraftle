import { useGlobal } from "@/context/Global/context";
import { useEffect, useState } from "react";

export default function Cursor() {
  const { items, cursorItem, setCursorItem } = useGlobal();
  const [cursorPosition, setCursorPosition] = useState({ left: 0, top: 0 });

  useEffect(() => {
    if (document) {
      document.addEventListener("mousemove", (e) => {
        setCursorPosition({ left: e.pageX - 5, top: e.pageY - 5 });
      });
    }
  }, []);

  return (
    <div
      id="cursor"
      style={{
        ...cursorPosition,
        backgroundImage: `url(${cursorItem && items[cursorItem].icon})`,
      }}
    ></div>
  );
}
