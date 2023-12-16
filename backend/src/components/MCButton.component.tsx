export default function MCButton(props: {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}) {
  const onClickWithSound = () => {
    const audioToPlay = new Audio("/audio/button_click.wav");
    audioToPlay.play();
    if (props.onClick) props.onClick();
  };
  return (
    <div
      className={"mc-button hover:cursor-pointer " + props.className}
      onClick={() => onClickWithSound()}
    >
      <div className="title">{props.children}</div>
    </div>
  );
}
