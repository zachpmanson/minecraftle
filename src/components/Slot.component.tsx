import { useGlobal } from "@/context/Global/context";
import { TableItem } from "@/types";

export default function Slot({
  item,
  backgroundColor,
  clickable,
  onClick,
  onMouseDown,
  onMouseUp,
  onMouseMove,
}: {
  item?: TableItem;
  backgroundColor?: string;
  clickable?: boolean;
  onClick?: () => void;
  onMouseDown?: () => void;
  onMouseUp?: () => void;
  onMouseMove?: () => void;
}) {
  const { items } = useGlobal();
  const itemImage = item ? items[item]?.icon : undefined;

  const click = (event: any) => {
    event.stopPropagation();
    if (clickable && onClick) {
      onClick();
    }
  };

  const mousedown = (event: any) => {
    event.stopPropagation();
    if (clickable && onMouseDown) {
      onMouseDown();
    }
  };

  const mouseup = (event: any) => {
    event.stopPropagation();
    if (clickable && onMouseUp) {
      onMouseUp();
    }
  };

  const mousemove = (event: any) => {
    if (clickable && onMouseMove) {
      onMouseMove();
    }
  };

  const backgroundImage = itemImage
    ? { backgroundImage: `url(${itemImage})` }
    : {};
  return (
    <div
      className="slot"
      style={{ backgroundColor: backgroundColor }}
      onClick={click}
      onMouseDown={mousedown}
      onMouseUp={mouseup}
      onMouseMove={mousemove}
    >
      <div className="slot-image" style={backgroundImage}></div>
    </div>
  );
}
