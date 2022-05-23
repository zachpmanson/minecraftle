import json
from os import remove

    


def main():
    print("type exit or control + C to exit\n", "type ingredients to save the ingredients with the new list\n", "type add to add the inputted string to the ingredients list\n", 
          "to remove ingredients type remove and then every ingredient name to remove them from the list\n", "for a list of recipe names type LOR\n",  "to REPEAT these instructions type help")
    
    recipenames = []
    with open("app\static\data\items.json") as f:
        jsonfile = json.load(f)
        for i in jsonfile:
            recipenames.append(i)
    ingredients = []
    remove_ingredients = []
    f = open("app/static/data/given_ingredients.json", "r+")
    for line in f:
        line = line.strip()
        
        if (line != "[" and line != "]"):
            newline = (line.replace("\"", ""))
            newline = newline.replace(",", "")
            ingredients.append(newline)

    while True:
        
        inp = input();
        
        match inp:
            case "ingredients":            
                print(ingredients)
                jsonfile = json.dumps(ingredients, indent=1)
                f.seek(0)
                f.truncate(0)
                f.write(jsonfile)
                f.close()
                
                    
            case "exit":
                break
            
            case "add":
                while True:
                    print(ingredients)
                    inpu = input()
                    if inpu == "exit":
                        break
                    else:
                        if inpu in recipenames:
                            ingredients.append(inpu)
                        else:
                            print("recipe not valid please refer to the list of recipe names")
            
            case "remove":
                while True:
                    print(ingredients)
                    inpute = input()
                    if inpute == "exit":
                        break
                    else:
                        if inpute in recipenames:
                            remove_ingredients.append(inpute)
                            ingredients = [x for x in ingredients if x not in remove_ingredients]
                        else:
                            print("recipe not valid please refer to the list of recipe names")
            case "LOR":
                print(recipenames)
                
            case "help":
                print("type exit or control + C to exit\n", "type ingredients to save the ingredients with the new list\n", "type add to add the inputted string to the ingredients list\n", 
                "to remove ingredients type remove and then every ingredient name to remove them from the list\n", "for a list of recipe names type LOR\n",  "to REPEAT these instructions type help")
   
    
if __name__ == "__main__":
    main()
    