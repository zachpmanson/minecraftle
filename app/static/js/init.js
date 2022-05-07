



let items;
let maxGuesses = 5;
let craftingTables = [];
let cursor = document.getElementById("cursor");
let cursorItem = null;

/**
 * Sets background of given div to given item
 * @param {HTMLElement} div 
 * @param {String} item 
 */
function setSlotBackground(div, item) {
    console.log("item: " + item)
    div.style.backgroundImage = (item === null) ? "none" : "url(" + items[item]["icon"] +")";
}

/**
 * Set cursor image to match cursorItem
 */
function setCursor() {
    // TODO will set the div image that follows the cursor    
}

/**
 * Create ingredients table from list.  Attaches event listeners to slots.
 */
function initIngredients() {
    let ingredientsList = document.getElementById("ingredientsList");
    //console.log(items)    
    
    // probably replace this with another json file to load in for easier puzzle mgmt
    let givenIngredients = [
        "minecraft:oak_planks",
        "minecraft:cobblestone",
        "minecraft:stone",
        "minecraft:sand",
        "minecraft:stick",
        "minecraft:iron_ingot",
        "minecraft:coal",
        "minecraft:redstone",
        "minecraft:string",
        "minecraft:feather",
        "minecraft:gunpowder",
    ];
    
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
    
    craftingTables.push([
        [null, null, null],
        [null, null, null],
        [null, null, null]
    ]);
    
    // Generate 9 slots
    for (let i = 0; i < 9; i++) {
        let slot = document.createElement("div");
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
            
            setCursor()
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
    imageDiv.classList.add("slot-image");
    slot.appendChild(imageDiv)
    
    slot.addEventListener("mousedown", e=>{
        // TODO only clickable if recipe is valid.
        // then should pass craftingTable[tableNum] to processGuess()
        // then should change slot background colors to green yellow etc
        // then should lock this table, remove all event listeners from it
        
        // placeholder
        addNewCraftingTable();
    });
    outputDiv.appendChild(slot);
    
    newTable.appendChild(outputDiv);
    document.getElementById("guesses").appendChild(newTable);
}

// Loads jsons after DOM has properly loaded
document.addEventListener('DOMContentLoaded', () => {
    addNewCraftingTable();

    fetch('static/data/items.json')
      .then(response => response.json())
      .then(obj => {items = obj; initIngredients()})

    // Will probably need to read in recipes.json here

});

// Check for dropping item if placed outside important divs.
let ingredientsDiv = document.getElementById("ingredients");
let guessesDiv = document.getElementById("guesses");
console.log(ingredientsDiv)
document.addEventListener("mousedown", e => {
    let isClickOutsideIngredients = ingredientsDiv.contains(e.target) || guessesDiv.contains(e.target);
    if (!isClickOutsideIngredients) {
        console.log("dropping item " + cursorItem)
        cursorItem = null;
    }
});


// TODO set event listener for mouse movement to let the cursorDiv follow the mouse around