import MCButton from "@/components/MCButton.component";
import { useGlobal } from "@/context/Global/context";
import Link from "next/link";

export default function Layout({ children }: any) {
  const { setCursorItem } = useGlobal();
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
                <MCButton className="flex-1">How To Play</MCButton>

                <Link
                  className="flex-1"
                  href="/stats/17026394272430.3935740135936261"
                >
                  <MCButton>Stats</MCButton>
                </Link>
                <div className="flex flex-1 justify-normal gap-4">
                  <div className="flex-1">
                    <MCButton>
                      <div className="px-4">♫</div>
                    </MCButton>
                  </div>
                  <div className="flex-1">
                    <MCButton>
                      <div className="px-4">☼</div>
                    </MCButton>
                  </div>
                </div>
              </div>
              <div className="flex gap-4">
                <Link className="flex-1" href="/">
                  <MCButton>Daily</MCButton>
                </Link>
                <MCButton className="flex-1">Random</MCButton>
              </div>
            </div>
          </nav>
        </header>
        <main>{children}</main>
      </div>
    </div>
  );
}
