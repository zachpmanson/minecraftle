from ast import pattern
import json, os
from multiprocessing.sharedctypes import Value
from re import L
recipesprocessed = []

path = '../recipes/'
recipes = [recipe for recipe in os.listdir(path) if recipe.endswith('.json')]
for i in recipes:
    jsonfile = open(path + i)
    recipesprocessed.append(json.load(jsonfile))
    
for i in recipesprocessed:
    standard_dict = {
            "type": "",
            "group": "",
            "output": "",
            "input": [
                    [None, None, None],
                    [None, None, None],
                    [None, None, None]
                ]
            }
    for key, value in i.items():
        if key == "type":
            standard_dict["type"] = value
            
        if key == "group":
            standard_dict["group"] = value
            
        if key == "pattern":
            for listindex, desiredpattern in enumerate(value):
                for desiredindex, desiredpattern in enumerate(desiredpattern):
                    standard_dict["input"][listindex][desiredindex] = desiredpattern
        
        if key == "key":
            for nestedkey, nestedvalue in value.items():
                for i in  standard_dict["input"]:
                    for x in i:
                        if x == nestedkey:
                            if isinstance(nestedvalue, dict):
                                for firstlist in range(len(standard_dict["input"])):
                                    for secondlist in range(len(standard_dict["input"][firstlist])):
                                        if standard_dict["input"][firstlist][secondlist] == nestedkey:
                                            standard_dict["input"][firstlist][secondlist] = 'None'.join(list(nestedvalue.values()))
                            else:
                                for firstlist in range(len(standard_dict["input"])):
                                    for secondlist in range(len(standard_dict["input"][firstlist])):
                                        if standard_dict["input"][firstlist][secondlist] == nestedkey:
                                            standard_dict["input"][firstlist][secondlist] = 'None'.join(list(nestedvalue[0].values()))
        if key == "result":
            if isinstance(value, dict):
                standard_dict["output"] = value["item"]
            else:
                standard_dict["output"] = value
    print(standard_dict)