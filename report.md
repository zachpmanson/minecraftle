# Minecraftle!

CITS3403 WebDev Project 2022

Due date: May 23, 2022 12:00 (noon)

Final Mark - TBD

Weighting - 30%

## Demo

The final project is hosted [here](https://minecraftle.zachmanson.com/#)
make sure you share your stats!!

## Contributors

This project was completed as a collaboration between:

[Zach Manson](https://github.com/pavo-etc)

<img alt="Zachs beautiful face" src="https://avatars.githubusercontent.com/u/24368336?v=4" width="100">

[Harrison Oates](https://github.com/Oatesha)

<img alt="Zachs beautiful face" src="https://avatars.githubusercontent.com/u/73292759?v=4" width="100">

[Tamura Boog](https://github.com/Tamura77)

<img alt="Zachs beautiful face" src="https://avatars.githubusercontent.com/u/92499933?v=4" width="100">

[Ivan Sossa](https://github.com/SossaG)

<img alt="Zachs beautiful face" src="https://avatars.githubusercontent.com/u/53945538?v=4" width="100">

## Purpose

The project brief can be found [here](https://teaching.csse.uwa.edu.au/units/CITS3403/) but the general purpose of the project was to build a daily puzzle game similar to wordle.

We designed our game with these three principles in mind:

 + **Engaging**, so that it looks good and a user wants to play it every day.\
 + **Challenging**, so the user feels a sense of achievement
 + **Intuitive**, so that it is easy for a user to access

Keeping these principles in mind we decided to capitalise on the popularity of Wordle as it was a game that all of us had played quite often and believed it covered these points well. Upon researching the Wordle-style game market we quickly realised there was a glaring gap: no Wordle-style game for the world's popular game Minecraft!. After commencing the project we found a game with a similar concept, however this game, whilst having a beautiful interface, lost sight of the charm of Wordle.  The puzzle hints are inconsistent and the ingredient list has many redudant items that impede the gameplay.

The essence of our game was to ensure that in the complexity of Minecraft we dont lose the simplicity that makes the daily puzzle quick and enjoyable.

### Architecture

We tried to abstract functions that our web application had to be able to complete into different files, under `/app/static/js/`.  The logic of buttons, cookies/webstorage, processing guesses, stats and page initialisation were all seperated into their own .js files. Further we have folders for audio, data, icons, images and styles which further abstracts each part of our project so that everything is easily debuggable.

The solution to the puzzle is generated in Flask where it is randomly chosen from the recipes in `/app/static/data/recipes.json` that only contain ingredients found in `/app/static/data/give-ingredients.json`.  For "Daily" puzzles the RNG seed is the date, for "Random" puzzles the RNG seed is unset.  This solution is inserted into the HTML through jinja2, and then read by the `/app/static/js/init.js`.

`/app/static/js/init.js` initialises many of the event listeners, loads in images, 
and creates global variables to store data in.  `/app/static/js/cookies.js` checks if this user has a UUID already stored in webstorage, generating a new UUID if the user doens't.  The UUID is based on milliseconds since Unix Epoch and Math.Random().

The user can pick up items and place them in the 3x3 grid to form a guess.  If they want to submit their guess the click on the empty slot to the right of the grid.  This will send their guess to `/app/static/js/processGuess.js`, which will compare the guess to all possible variants of the solution (in Minecraft, crafting recipes have multiple positions and orientations).  The 2D arrays returned by `processGuess()` are used to colour the crafting tables to give user feedback, before a new crafting table is added and the previous table is frozen.

Once the user determines the solution or hits the maximum number of guesses, a popup appears with the solution, an shareable emoji-obfuscated summary of their guesses, and a link to their user statitics page.

Clicking the stats button will redirect the user to a page such as:

`localhost:5000/stats/16532725040000.8878274171882354?win=1&attempts=1`

Flask interprets this as the user_id, and attempts to add the win and attempts key-pair values to the `minecraftle.db` database.  This may or may not succeed (max 1 submission per day per user, malformed input), but will then redirect the user to their own personal stats page such as:

`localhost:5000/stats/16532725040000.8878274171882354`

This link is shareable, and uses SQL commands on `minecraftle.db` to find the user statistics and generate a ranking.

## Launching

To launch on local host you must first clone the repository into a directory that suits with the following command:

```
git clone https://github.com/pavo-etc/cits3403-project
```

Next install the necessary requirements with the following:

```
pip install -r requirements.txt
```

Navigate to the cloned repository and then run the server with the following, additionally you can specify the host ip and port number with the --host and --port flags:

```
flask run
```

If you have not specified different host IP or port number the server will be reachable on localhost:5000.


## Unit tests and Validation

Our tests cover basic cases that are self explanatory in the function names. To run our tests the venv must be active and the flask server must be running, our default unit tests use Firefox webdriver.

Our validation was done on the W3C website found [here](https://validator.w3.org/) we put in the local host url and it passed both tests for HTML and CSS!

`python -m tests.systemtest`


## Admin Scripts

We have a few python scripts to aid the setup and vetting of puzzles:

### `change_puzzles.py`

This is the big script that constantly asks for input from the user (presumably admin) to vet the possible puzzles, you can add and remove ingredients from the given_ingredients.json file which will then vet the possible puzzles to only match puzzles that can be made from the given ingredients. The script is rudamentary and instructions are printed when it runs. The validation of the admin submitted puzzles happens in the script ensuring only valid recipe names can be submitted.

### `recipe.py`

This script was just to go through the recipe.json files in the minecraft source code and change the formatting to work with our process guess JS functions. We took the jsons from this format.

![original recipe format](/app/static/images/original.png)

To this format.

![New format](/app/static/images/new.png)

Once all the recipes were put into this format we saved them into a sanitised recipes folder.

### `merge_recipes.py`

This file takes the list of sanitised recipes and merges them into a single json file to make processing easier in the JS file.

