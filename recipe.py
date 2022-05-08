import json, os
recipesprocessed = []
standard_dict = {
  "type": "",
  "output": "",
  "input": [
        [None, None, None],
        [None, None, None],
        [None, None, None]
    ]
}

path = 'recipes/'
recipes = [recipe for recipe in os.listdir(path) if recipe.endswith('.json')]
for i in recipes:
    jsonfile = open(path + i)
    recipesprocessed.append(json.load(jsonfile))
    
for i in recipesprocessed:
    for key in i.keys():
        if key == "pattern":
            i[key]
    