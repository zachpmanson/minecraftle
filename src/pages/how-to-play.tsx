import Link from "next/link";

export default function HowToPlay() {
  return (
    <main>
      <div className="inv-background">
        <h2 className="text-center">How To Play</h2>
        <p className="text-center font-bold">
          Your goal is to try to craft the secret item from the ingredients in
          your inventory:
        </p>
        <ol className="list-decimal p-4">
          <li>
            You have <span className="font-bold">10</span> guesses
          </li>
          <li>
            If your guess is incorrect, some of the grid may be coloured to give
            you feedback
          </li>
          <li>
            If the square remains grey, the ingredient you placed here is not in
            the recipe, hmmm...
          </li>
          <li>
            An orange square means that this ingredient is needed somewhere else
            on the grid, but not at the spot...
          </li>
          <li>
            A green square means the ingredient placed on that square is correct
            and in the right spot!
          </li>
        </ol>
        <p className="text-center font-bold">
          Click below to start the game and test your true knowledge of
          Minecraft...Your reputation is on the line!
        </p>
        <p className="text-center text-blue-700">
          <Link href="/">Play game!</Link>
        </p>
      </div>
      <div className="inv-background">
        <h2>About</h2>
        <p>
          Originally created by Tamura Boog, Zach Manson, Harrison Oates, Ivan
          Sossa Gongora in 2022. Other contributors can be seen on the GitHub
          repo.
        </p>
        <p>
          Built originally Flask, recently rebuilt with Next.js and React.
          <br />
          Source code:{" "}
          <a
            href="https://github.com/pavo-etc/minecraftle"
            className="text-blue-700"
          >
            GitHub
          </a>
        </p>
        <p>
          Hosted by <a href="https://zachmanson.com">Zach Manson</a>. If you are
          reading this please{" "}
          <a href="mailto:zachpmanson@gmail.com">email me</a> and tell me how
          you found the site since I haven&apos;t a clue.
        </p>
      </div>
    </main>
  );
}
