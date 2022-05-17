import json, os
from operator import indexOf
from tkinter import N

def writejson(dictionary, filename):
    jsonobject = json.dumps(dictionary, indent = 4)
    with open(("../sanitised recipes/" + filename), 'w') as jsonfile:
        jsonfile.write(jsonobject)
    


def processrecipes(path):
    recipesprocessed = []

    recipes = [recipe for recipe in os.listdir(path) if recipe.endswith('.json')]
    for i in recipes:
        jsonfile = open(path + i)
        recipesprocessed.append(json.load(jsonfile))
        
    for jsonfile, name in zip(recipesprocessed, recipes):
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
        for key, value in jsonfile.items():
            if key == "type":
                standard_dict["type"] = value
                
            if key == "group":
                standard_dict["group"] = value
                
                
            if key == "pattern":
                for listindex, desiredpattern in enumerate(value):
                    for desiredindex, desiredpattern in enumerate(desiredpattern):
                        if desiredpattern != ' ':
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
            if key == "ingredients":
                if isinstance(value, list):
                    del standard_dict["input"]
                    for i in value:
                        if isinstance(i, dict):
                            for ingredientkey in i.keys():
                                if "input" in standard_dict:
                                    standard_dict["input"].append(i[ingredientkey])
                                    
                                else:
                                    standard_dict["input"] = list(i[ingredientkey].split())
                        else:
                            if "input" in standard_dict:
                                standard_dict["input"].append(i)
    
                            else:
                                standard_dict["input"] = list(i)


            
            if key == "result":
                if isinstance(value, dict):
                    standard_dict["output"] = value["item"]
                else:
                    standard_dict["output"] = value
        
        for index, element in enumerate(standard_dict["input"]):
            nullcount = 0;
            for j in element:
                if j == None:
                    nullcount += 1
            if nullcount == 3:
                del standard_dict["input"][index]
        writejson(standard_dict, name)

    
def main():
    processrecipes("../recipes/")

if __name__ == "__main__":
    main()