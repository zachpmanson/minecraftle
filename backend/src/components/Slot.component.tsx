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

  const clickAction = (event: any) => {
    event.stopPropagation();
    if (clickable && onClick) {
      onClick();
    }
  };
  const backgroundImage = itemImage
    ? { backgroundImage: `url(${itemImage})` }
    : {};
  return (
    <div
      className="slot"
      style={{ backgroundColor: backgroundColor }}
      onClick={clickAction}
    >
      <div className="slot-image" style={backgroundImage}></div>
    </div>
  );
}
