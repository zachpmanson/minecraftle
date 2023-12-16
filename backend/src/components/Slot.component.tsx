import { useGlobal } from "@/context/Global/context";
import { TableItem } from "@/types";

export default function Slot({
  item,
  backgroundColor,
  clickable,
  onClick,
}: {
  item?: TableItem;
  backgroundColor?: string;
  clickable?: boolean;
  onClick?: () => void;
}) {
  const { items } = useGlobal();
  const itemImage = item ? items[item]?.icon : undefined;
  console.log(itemImage);
  const clickAction = (event: any) => {
    event.stopPropagation();
    if (clickable && onClick) {
      onClick();
    }
  };
  return (
    <div className="slot" onClick={clickAction}>
      <div
        className="slot-image"
        style={{ backgroundImage: `url(${itemImage})` }}
      ></div>
    </div>
  );
}
