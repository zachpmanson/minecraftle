from flask import render_template, url_for, request, redirect, jsonify

from app import app 
from app import database

import random
import json
from datetime import datetime, date
import math

import pytz

TIMEZONE = 'Australia/Perth' # set this to None to use machine timezone

with open("app/static/data/given_ingredients.json", "r") as f:
    given_ingredients = json.load(f)

with open("app/static/data/recipes.json", "r") as f:
    recipes = json.load(f)

all_recipes_names = list(recipes.keys())

valid_recipe_names = []

for recipe_name in all_recipes_names:
    valid = True
    items_in_recipe = set()
    if recipes[recipe_name]["type"] != "minecraft:crafting_shaped": continue
    for row in recipes[recipe_name]["input"]:
        for item in row:
            #print(item)
            if item is not None:
                items_in_recipe.add(item)

    for item in items_in_recipe:
        if item not in given_ingredients:
            valid = False
    if valid:
        valid_recipe_names.append(recipe_name)



@app.route('/')
@app.route('/index')
def index():
    # goto example.com/?random=True
    unseeded_random = request.args.get("random")
    if not unseeded_random:
        if TIMEZONE:
            random.seed(datetime.now(pytz.timezone(TIMEZONE)).strftime('%Y-%m-%d'))
        else:
            random.seed(datetime.today().strftime('%Y-%m-%d'))
    else:
        random.seed(None)
    solutionstring = random.choice(valid_recipe_names)
    print(solutionstring)


    render_args = {
        "title":"Minecraftle",
        "solution": solutionstring
    }

    if TIMEZONE:
        render_args["timezone"] = TIMEZONE

    return render_template(
        'index.html',
        **render_args
    )


@app.route('/how-to-play')
def rules():
    render_args = {
        "title":"How To Play"        
    }
    return render_template(
        'how-to-play.html',
        **render_args
    )

@app.route('/stats/<user_id>')
def statistics(user_id):

    games_played = 0
    wins = 0
    rank = "N/A"

    wins_records, games_played_records, user_attempt_wincounts = database.get_records(user_id)

    games_played = games_played_records[0][0]
    up_score = math.inf
    down_score = -1
    position = "N/A"
    total_player_count = len(wins_records)

    for i, record in enumerate(wins_records):

        # if this record is lower than previous, set up_score to previous, stop checking after we have found a rank
        if rank == "N/A" and i != 0 and record[1] < wins_records[i-1][1]:
            up_score = wins_records[i-1][1]
        
        # get score of person below user_id, can exit loop after that
        if rank != "N/A":
            down_score = max(down_score, record[1])
            break

        if record[0] == user_id:
            wins = record[1]
            position = i+1
            rank = str(i+1)+"/"+str(len(wins_records))
            position = i+1

    # Convert user_attempt_wincounts tuples to a dict (x-1 is to use 0 indexing)
    user_attempts = {x-1:y for x, y in user_attempt_wincounts}

    expanded_user_attempts_wincounts = [None] * 10
    for i, row in enumerate(expanded_user_attempts_wincounts):
        if i in user_attempts.keys():
            # if there is a wincount for this many attempts
            expanded_user_attempts_wincounts[i] = user_attempts[i]
        else:
            expanded_user_attempts_wincounts[i] = 0

    render_args = {
        "title":"Stats",
        "games_played":games_played,
        "wins":wins,
        "up_diff":up_score-wins,
        "down_diff":wins-down_score,
        "position":position,
        "total_player_count":total_player_count,
        "rank":rank,
        "attempts":expanded_user_attempts_wincounts
    }
    return render_template(
        'stats.html',
        **render_args
    )

@app.route('/api/submitgame')
def submitstats():
    user_id = request.args.get("user_id")
    win = request.args.get("win")
    attempts = request.args.get("attempts")
    print(user_id, win, attempts)
    response = {"succeeded":0}
    if None not in (user_id, win, attempts):
        if TIMEZONE:
            today = datetime.now(pytz.timezone(TIMEZONE)).strftime('%Y-%m-%d')
        else:
            today = datetime.today().strftime('%Y-%m-%d')
        try:
            float(user_id)
            response["succeeded"] = database.insert_record(user_id, today, int(win), int(attempts))
        except ValueError:
            print("Attmpted SQL injection!")
    print(response)
    return jsonify(response)

@app.errorhandler(404)
def pagenotfound(e):
    return render_template('404.html'), 404
