import json
import os

all_recipes = {}
dir = "app/static/data/sanitised recipes"

for filename in os.listdir(dir):
    f = os.path.join(dir, filename)
    if os.path.isfile(f):
        with open(f,"r") as file:
            print(f)
            extless_filename = filename[:filename.find(".")]
            all_recipes[extless_filename] = json.load(file)

print(all_recipes.keys())
with open("app/static/data/recipes.json", "w") as write_file:
    json.dump(all_recipes, write_file)
