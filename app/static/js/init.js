



let items;
let maxGuesses = 5;
let craftingTables = [];
let cursor = document.getElementById("cursor");
let cursorItem = null;
let givenIngredients;
/**
 * Sets background of given div to given item
 * @param {HTMLElement} div 
 * @param {String} item 
 */

const onMouseMove = (e) => {
    cursor.style.left = (e.pageX - 5) + 'px';
    cursor.style.top = (e.pageY - 5) + 'px';

}

document.addEventListener("mousemove", onMouseMove);

function setSlotBackground(div, item) {
    console.log("item: " + item)
    div.style.backgroundImage = (item === null) ? "none" : "url(" + items[item]["icon"] +")";
}


var click = document.getElementById("audio");

function playAudio() {
  click.play();
}

buttons = document.getElementsByClassName("mc-button");
console.log(buttons);
for (let i = 0; i < buttons.length; i ++) {
    // buttons[i].addEventListener("mousedown", playAudio());
}

/**
 * Set cursor image to match cursorItem
 */
function setCursor(item) {
    setSlotBackground(cursor, item);
}

/**
 * Create ingredients table from list.  Attaches event listeners to slots.
 */
function initIngredients() {
    let ingredientsList = document.getElementById("ingredientsList");
    //console.log(items)    
    
    // probably replace this with another json file to load in for easier puzzle mgmt
    
    givenIngredients.forEach((ingredient, i)=>{
        let newSlot = document.createElement("div");
        let image = document.createElement("div");

        newSlot.classList.add("slot");
        newSlot["item"] = ingredient;
        image.classList.add("slot-image");

        newSlot.appendChild(image);
        setSlotBackground(image, ingredient);
        ingredientsList.appendChild(newSlot);

        newSlot.addEventListener("mousedown",e=>{
            cursorItem = (e.target.parentElement["item"]);
            console.log("Picked up " + cursorItem);
            setCursor(cursorItem);
        });

    });
}

/**
 * Creates a new crafting table element.  Adds empty crafting table to craftingTables.
 * Adds event listeners to slots for item placing and movement.
 */
function addNewCraftingTable() {
    let ingredientsList = document.getElementById("ingredientsList");
    let newTable = document.createElement("div");
    let tableNum = craftingTables.length;
    newTable["tableNum"] = tableNum;
    newTable.classList.add("inv-background"); 
    newTable.classList.add("flex");
    
    let tableDiv = document.createElement("div");
    tableDiv.classList.add("crafting-table");
    tableDiv.setAttribute("id", "tablenumber" + tableNum);
    
    craftingTables.push([
        [null, null, null],
        [null, null, null],
        [null, null, null]
    ]);
    
    // Generate 9 slots
    for (let i = 0; i < 9; i++) {
        let slot = document.createElement("div");
        slot.setAttribute("id", i);
        slot.classList.add("slot");
        slot["row"] = Math.floor(i/3);
        slot["col"] = i % 3;
        console.log("Creating slot: " + slot["row"] + " " + slot["col"])
        tableDiv.appendChild(slot);
        let imageDiv = document.createElement("div");
        imageDiv.classList.add("slot-image");
        slot.appendChild(imageDiv);

        slot.addEventListener("mousedown", e=>{

            // switch held item and slot item
            if (cursorItem === null) {
                cursorItem = craftingTables[tableNum][slot["row"]][slot["col"]];
                craftingTables[tableNum][slot["row"]][slot["col"]] = null;;
                setSlotBackground(imageDiv, null);

                console.log("Placed " + null + " in position " + slot["row"] + " " + slot["col"] + " in table " + tableNum)
                console.log(craftingTables[tableNum])
                console.log("Picked up " + cursorItem)
            } else {
                
                let temp = (cursorItem === null) ? null : cursorItem.slice();
                cursorItem = craftingTables[tableNum][slot["row"]][slot["col"]];
                craftingTables[tableNum][slot["row"]][slot["col"]] = temp;
                
                setSlotBackground(imageDiv, temp);
                
                console.log("Placed " + temp + " in position " + slot["row"] + " " + slot["col"] + " in table " + tableNum)
                console.log(craftingTables[tableNum])
                console.log("Picked up " + cursorItem)
            }
            setCursor(cursorItem);
            
            // TODO presumably this will then need to calculate if current craftingTable is a valid recipe
            
            
        })
    }

    newTable.appendChild(tableDiv)
    
    let arrowDiv = document.createElement("div");
    arrowDiv.classList.add("arrow");
    let arrow = document.createElement("p");
    arrow.innerText = "→";
    arrowDiv.appendChild(arrow);
    newTable.appendChild(arrowDiv)
    
    let outputDiv = document.createElement("div");
    outputDiv.classList.add("crafting-output")
    let slot = document.createElement("div");
    slot.classList.add("slot")
    let imageDiv = document.createElement("div");
    slot.setAttribute("id", "solutiondiv" + tableNum);
    imageDiv.classList.add("slot-image");
    slot.appendChild(imageDiv)
    
    slot.addEventListener("mousedown", e=>{
        // TODO only clickable if recipe is valid.
        // then should pass craftingTable[tableNum] to processGuess()
        // then should change slot background colors to green yellow etc
        // then should lock this table, remove all event listeners from it
        
        // placeholder
        var isCorrect = processGuess(craftingTables[tableNum]);

        // Update solution div to display the correct item, change slot background and lock table
        console.log(isCorrect[0], isCorrect[1]);
        if (isCorrect[0]) {
            console.log(solution_item), "solution item";
            setSlotBackground(imageDiv, solution_item);
            for (const [index, element] of isCorrect[1].entries()) {
                console.log("index: "+ index+" element: " + element)
                for (let i = 0; i < 3; i++) {
                    if (index === 1) {j = i + 4}
                    else if (index === 2) {j = i + 7}
                    else {j = i + 1}
                    const slot = document.querySelector("#tablenumber" + tableNum + " :nth-child(" + j + ")");
                    console.log(slot, j);
                    if (element[i] === 2) {
                        slot.classList.add("greenguess");
                    }
                    slot.classList.add("lockedslot");
                    slot.classList.remove("slot");
                }
            }
            
        } else {
                for (const [index, element] of isCorrect[1].entries()) {
                    for (let i = 0; i < 3; i++) {
                        if (index === 1) {j = i + 4}
                        else if (index === 2) {j = i + 7}
                        else {j = i + 1}
                        const slot = document.querySelector("#tablenumber" + tableNum + " :nth-child(" + j + ")");
                        
                        if (element[i] === 2) {
                            slot.classList.add("greenguess");
                        }
                        
                        //TODO change 3 to whatever index in matchmap is correct ingredient but wrong position
                        else if (element[i] === 3) {
                            
                            slot.classList.add("orangeguess");
                        }
                        
                        slot.classList.add("lockedslot");
                        slot.classList.remove("slot");   
                    }
                }
                addNewCraftingTable();    // if (craftingTables[tableNum][0]
        }
        var lockedtable = document.getElementById("tablenumber" + tableNum);
        lockedtable.replaceWith(lockedtable.cloneNode(true));
        var solutiondiv = document.getElementById("solutiondiv" + tableNum);
        solutiondiv.classList.add("lockedslot");
        solutiondiv.classList.remove("slot");
        solutiondiv.replaceWith(solutiondiv.cloneNode(true));
           
    });
    outputDiv.appendChild(slot);
    
    newTable.appendChild(outputDiv);
    document.getElementById("guesses").appendChild(newTable);
}

// Loads jsons after DOM has properly loaded
document.addEventListener('DOMContentLoaded', () => {
    addNewCraftingTable();

    
    fetch('static/data/given_ingredients.json')
      .then(response => response.json())
      .then(obj => {givenIngredients = obj});

    fetch('static/data/items.json')
      .then(response => response.json())
      .then(obj => {items = obj; initIngredients()});

    
    getSolutionRecipe();

    // Will probably need to read in recipes.json here

});

// Check for dropping item if placed outside important divs.
let ingredientsDiv = document.getElementById("ingredients");
let guessesDiv = document.getElementById("guesses");
console.log(ingredientsDiv)
document.addEventListener("mousedown", e => {
    let isClickOutsideIngredients = ingredientsDiv.contains(e.target) || guessesDiv.contains(e.target);
    if (!isClickOutsideIngredients) {
        console.log("dropping item because outside ingredients " + cursorItem)
        cursorItem = null;
        setCursor(cursorItem);
    }
});

document.addEventListener("mousemove", (e) => {
    cursor.style.left = (e.pageX - 5) + 'px';
    cursor.style.top = (e.pageY - 5) + 'px';
});
