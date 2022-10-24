# Minecraftle

A daily puzzle game fusing Wordle and Minecraft crafting recipes built with Flask and JavaScript.

[Play Minecraftle](https://minecraftle.zachmanson.com)

## Running

```sh
pip install -r requirements.txt
flask run
```

## Contributors

| [Zach Manson](https://github.com/pavo-etc) | [Harrison Oates](https://github.com/Oatesha) | [Tamura Boog](https://github.com/Tamura77) | [Ivan Sossa](https://github.com/SossaG) |
| --- | --- | --- | --- |
| <img alt="Zach's beautiful face" src="https://avatars.githubusercontent.com/u/24368336?v=4" width="100"> | <img alt="Oates' beautiful face" src="https://avatars.githubusercontent.com/u/73292759?v=4" width="100"> | <img alt="Tamura's beautiful face" src="https://avatars.githubusercontent.com/u/92499933?v=4" width="100"> | <img alt="Ivan's beautiful face" src="https://avatars.githubusercontent.com/u/53945538?v=4" width="100"> |

CITS3403 Agile Web Development Project 2022

Due date: May 23, 2022 12:00 (noon)

Weighting: 30%

Final mark: 100%

## Todo

### General Todos:
 + [x] Come up with idea
 + [x] Find Minecraft recipes list
   + [x] Import required recipes into repo (potentially all of them)
 + [x] Back end functionality (50%)
   + [x] A user account and tracking feature.
   + [x] A method to store puzzles and results.
   + [x] A method to update and vet puzzles.
     + [x] given_ingredients.json used to modify potential puzzles
   + [x] A mechanism for users to share their achievements.
 + [x] Front end functionality (50%)
  + [x] 3 page views
    + [x] Instructions and description
    + [x] Actual puzzle interface
      + [x] General structure
      + [x] Crafting tables/Inventory
      + [x] Minecraft-esque appearance
      + [x] Picking up and placing items
      + [x] Item follow mouse movement
      + [x] Freezing past guesses
      + [x] Setting slot colour hints on guess submission
      + [x] Valid crafting recipe check
      + [x] Success screen
    + [x] aggregate results and stats

### Misc. Features Todos:
+ [x] Generate shareable emoji text from progressGuess() return tables
  + [x] Make popups that are triggered by winner() and loser() that shows a shareable emoji text like wordle, has button linking to view user stats
+ [x] A system for admins to add/remove from given_ingredients and recipes
+ [x] Make it play nicely on mobile (reactive to device size)
+ [x] An indicator for the guess number
+ [x] UNIT TESTS + SELEIUM TESTS

### Submission Todos:
+ [x] Complete writeup in the README.md file
  1. the purpose of the web application, explaining the design of the game
  2. the architecture of the web application.
  3. describe how to launch the web application.
  4. describe some unit tests for the web application, and how to run them.
+ [x] Include commit logs, showing contributions and review from all contributing students (`.git` is not included so git log must be a seperate file)
+ [x] Add comments and jsdoc
+ [x] Freeze all pip requirements (may just be flask) (`pip freeze > requirements.txt`)
+ [x] Validation (https://validator.w3.org/)
  + [x] HTML
  + [x] CSS
  + [x] JavaScipt
+ [x] Add references to pictures/recipe json files/libraries/css to `references.txt` (do this as we go)
