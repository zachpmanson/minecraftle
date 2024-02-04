import { useGlobal } from "@/context/Global/context";
import { Dialog, Transition } from "@headlessui/react";
import Link from "next/link";
import { Fragment, useState } from "react";
import MCButton from "./MCButton.component";
import Slot from "./Slot.component";

export default function Popup({
  isOpen,
  closeModal,
  isRandom,
}: {
  isOpen: boolean;
  closeModal: () => void;
  isRandom: boolean;
}) {
  const {
    gameState,
    solution,
    craftingTables,
    colorTables,
    userId,
    options: { highContrast },
    resetGame,
  } = useGlobal();
  const [copyButtonText, setCopyButtonText] = useState("Copy");
  console.log("highContrast", highContrast);
  const generateSummary = () => {
    let summaryString = `Minecraftle ${new Date().toISOString().slice(0, 10)} ${
      craftingTables.length
    }/10\n`;

    for (let table of colorTables) {
      for (let row of table) {
        for (let slot of row) {
          if (slot === 2) {
            summaryString += highContrast ? "🟧" : "🟩";
          } else if (slot === 3) {
            summaryString += highContrast ? "🟦" : "🟨";
          } else {
            summaryString += "⬜";
          }
        }
        summaryString += "\n";
      }
      summaryString += "\n";
    }
    console.log("summaryString", summaryString);
    return summaryString.trim();
  };

  const copyToClipboard = (str: string) => {
    if (navigator && navigator.clipboard && navigator.clipboard.writeText)
      return navigator.clipboard.writeText(str);
    return Promise.reject("The Clipboard API is not available.");
  };

  const handleCopy = () => {
    copyToClipboard(generateSummary()).then(() => {
      setCopyButtonText("Copied!");
      setTimeout(() => {
        setCopyButtonText("Copy");
      }, 1000);
    });
  };

  // get name of solution item for label
  const { items } = useGlobal();
  const solutionName =
    "minecraft:" + solution ? items["minecraft:" + solution]?.name : undefined;

  return (
    <>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-sm transform overflow-hidden rounded-2xl inv-background text-left align-middle shadow-xl transition-all">
                  <div className="flex flex-col items-center gap-2">
                    <Slot item={`minecraft:${solution}`} clickable={false} />
                    <Dialog.Description className="text-med font-medium leading-6 text-gray-900">
                      {`Solution: ` + solutionName}
                    </Dialog.Description>
                    <Dialog.Title
                      as="h3"
                      className="text-lg font-medium leading-6 text-gray-900"
                    >
                      You {gameState}! Took {craftingTables.length} guesses.
                    </Dialog.Title>
                    {!isRandom && (
                      <p className="whitespace-pre text-center max-h-96 overflow-y-scroll">
                        {generateSummary()}
                      </p>
                    )}
                    <div className="flex flex-col gap-2">
                      <div className="flex gap-2">
                        {!isRandom && (
                          <>
                            <MCButton onClick={() => handleCopy()}>
                              {copyButtonText}
                            </MCButton>
                            <Link href={userId ? `/stats/${userId}` : ""}>
                              <MCButton onClick={closeModal}>Stats</MCButton>
                            </Link>
                          </>
                        )}
                        <MCButton onClick={closeModal}>Close</MCButton>
                        {isRandom && (
                          <MCButton
                            onClick={() => {
                              closeModal();
                              resetGame(true);
                            }}
                          >
                            New Random
                          </MCButton>
                        )}
                      </div>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
