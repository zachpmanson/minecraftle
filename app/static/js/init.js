



let items;
let maxGuesses = 5;
let craftingTables = [];

function setSlotBackground(div, item) {
    div.style.backgroundImage = "url(" + items[item]["icon"] +")";
}

function initIngredients() {
    let ingredientsList = document.getElementById("ingredientsList");
    //console.log(items)    
    
    // probably replace this with another json file
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
        newSlot["value"] = ingredient
        image.classList.add("slot-image");

        newSlot.appendChild(image)
        setSlotBackground(image, ingredient)
        ingredientsList.appendChild(newSlot)
    });
}

function addNewCraftingTable() {
    let ingredientsList = document.getElementById("ingredientsList");
    let newTable = document.createElement("div");
    newTable["tableNum"] = craftingTables.length;
    newTable.classList.add("inv-background"); 
    newTable.classList.add("flex");
    
    let tableDiv = document.createElement("div");
    tableDiv.classList.add("crafting-table");
    
    for (let i = 0; i < 9; i++) {
        let slot = document.createElement("div");
        slot.classList.add("slot");
        slot["row"] = Math.floor(i/3);
        slot["col"] = i % 3;
        console.log("Creating slot: " + slot["row"] + " " + slot["col"])
        tableDiv.appendChild(slot);
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
    
    outputDiv.appendChild(slot);
    
    newTable.appendChild(outputDiv);
    
    craftingTables.push([
        [null, null, null],
        [null, null, null],
        [null, null, null]
    ]);
    document.getElementById("guesses").appendChild(newTable);
}


document.addEventListener('DOMContentLoaded', () => {
    addNewCraftingTable();

    fetch('static/data/items.json')
      .then(response => response.json())
      .then(obj => {items = obj; initIngredients()})

});
