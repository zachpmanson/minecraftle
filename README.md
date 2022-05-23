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

<strong>Engaging,</strong> so that it looks good and a user wants to play it every day.

<strong>Challenging,</strong> so the user feels a sense of achievement

<strong>Intuitive,</strong> so that it is easy for a user to access

Keeping these principles in mind we decided to capitalise on the popularity of wordle as it was a game that all of has had played qutie often and believed it covered these points well. Upon researching the wordle clone market we quickly realised there was a glaring gap with no wordle clone for the popular game minecraft!. After commencing the project we found a game with a similar concept, however this clone whilst having a beautiful interface lost sight of the charm of wordle and the puzzle is long hints are obfuscated and the ingredient list has many redudant items.

The essence of our clone was to ensure that in the complexity of minecraft we dont lose the simplicity that makes the daily puzzle quick and enjoyable.

### Architecture
We tried to abstract functions that our web application had to be able to complete into different files, under static in the JS folder we had files for the logic of buttons, cookies, processing guesses, stats and initialisation. Further we have folders for audio, data, icons, images and styles which further abstracts each part of our project so that everything is easily debuggable.

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

If you have not specified different host IP or port number the server will be reachable on localhost:5000


## Unit tests

Our tests cover basic cases that are self explanatory in the function names. To run our tests the venv must be active and the flask server must be running, our default unit tests use Firefox webdriver

## Python scripts

We have a few python scripts to aid the setup and vetting of puzzles:

### Change_puzzles.py

This is the big script that constantly asks for input from the user (presumably admin) to vet the possible puzzles, you can add and remove ingredients from the given_ingredients.json file which will then vet the possible puzzles to only match puzzles that can be made from the given ingredients. The script is rudamentary and instructions are printed when it runs. The validation of the admin submitted puzzles happens in the script ensuring only valid recipe names can be submitted.

### Recipe.py

This script was just to go through the recipe.json files in the minecraft source code and change the formatting to work with our process guess JS functions. We took the jsons from this format.

![original recipe format](/app/static/images/original.png)

To this format.

![New format](/app/static/images/new.png)

Once all the recipes were put into this format we saved them into a sanitised recipes folder.

### Merge_recipes.py
This file takes the list of sanitised recipes and merges them into a single json file to make processing easier in the JS file.

