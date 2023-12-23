import MCButton from "@/components/MCButton.component";
import { useGlobal } from "@/context/Global/context";
import Link from "next/link";
import { useState, useRef } from "react";

export default function Layout({ children }: any) {
  const { setCursorItem, userId, setOptions, resetGame } = useGlobal();
  const [isPlaying, setIsPlaying] = useState(false);
  const audioToPlay = useRef<HTMLAudioElement>();
  const playMusic = () => {
    if (isPlaying) {
      audioToPlay.current?.pause();
    } else {
      audioToPlay.current = new Audio(
        "/audio/C418 - Aria Math (Minecraft Volume Beta).mp3"
      );
      audioToPlay.current.play();
    }
    setIsPlaying((o) => !o);
  };
  return (
    <div
      onClick={(e) => {
        setCursorItem(undefined);
      }}
    >
      <div className="flex flex-col gap-4 max-w-xl m-auto">
        <header>
          <h1 className="text-center m-0 p-2 text-5xl">MINECRAFTLE</h1>
          <nav>
            <div className="flex flex-col gap-2">
              <div className="flex justify-evenly gap-4">
                <Link className="flex-1" href="/how-to-play">
                  <MCButton className="flex-1">How To Play</MCButton>
                </Link>

                <Link className="flex-1" href={`/stats/${userId.toString()}`}>
                  <MCButton>Stats</MCButton>
                </Link>
                <div className="flex flex-1 justify-normal gap-4">
                  <div className="flex-1">
                    <MCButton onClick={playMusic}>
                      <div className="px-4">♫</div>
                    </MCButton>
                  </div>
                  <div className="flex-1">
                    <MCButton
                      onClick={() =>
                        setOptions((o) => {
                          return { ...o, highContrast: !o.highContrast };
                        })
                      }
                    >
                      <div className="px-4">☼</div>
                    </MCButton>
                  </div>
                </div>
              </div>
              <div className="flex gap-4">
                <Link className="flex-1" href="/">
                  <MCButton onClick={() => resetGame(false)}>Daily</MCButton>
                </Link>
                <Link className="flex-1" href="/?random=true">
                  <MCButton className="flex-1" onClick={() => resetGame(true)}>
                    Random
                  </MCButton>
                </Link>
              </div>
            </div>
          </nav>
        </header>
        <main>{children}</main>
      </div>
    </div>
  );
}
