from flask import render_template, url_for

from app import app 

import random
import json
from datetime import datetime

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
    random.seed(datetime.today().strftime('%Y-%m-%d'))
    solutionstring = random.choice(valid_recipe_names)
    print(solutionstring)
    render_args = {
        "title":"Minecraftle",
        "solution": solutionstring
    }
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
@app.route('/stats')
def statistics():
    render_args = {
        "title":"Stats"        
    }
    return render_template(
        'stats.html',
        **render_args
    )
