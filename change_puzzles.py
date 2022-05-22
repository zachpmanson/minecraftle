import json

    


def main():
    print("type exit or control + C to exit\n", "type ingredients to save the ingredients with the new list\n", "type add to add the inputted string to the ingredients list\n", 
          "for a list of recipe names type LOR\n", "to REPEAT these instructions type help")
    
    recipenames = []
    with open("app\static\data\items.json") as f:
        jsonfile = json.load(f)
        for i in jsonfile:
            recipenames.append(i)
        
    while True:
        ingredients = []
        inp = input();
        
        match inp:
            case "ingredients":
                with open("app/static/data/test.json", "r+") as f:
                    for line in f:
                        line = line.strip()
                        
                        if (line != "[" and line != "]"):
                            newline = (line.replace("\"", ""))
                            newline = newline.replace(",", "")
                            ingredients.append(newline)
                            
                    print(ingredients)
                    jsonfile = json.dumps(ingredients, indent=1)
                    f.write(jsonfile)
                    
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
            case "LOR":
                print(recipenames)
                
            case "help":
                print("type exit or control + C to exit\n", "type ingredients to save the ingredients with the new list\n", "type add to add the inputted string to the ingredients list\n", 
                "for a list of recipe names type LOR")
   
    
if __name__ == "__main__":
    main()
    