



let items;
let maxGuesses = 10;
let craftingTables = [];
let cursor = document.getElementById("cursor");
let cursorItem = null;
let givenIngredients;

let emojiSummaries = []

/**
 * Sets background of given div to given item
 * @param {HTMLElement} div 
 * @param {String} item 
 */
function setSlotBackground(div, item) {
    div.style.backgroundImage = (item === null) ? "none" : "url(" + items[item]["icon"] +")";
}


var click = document.getElementById("audio");

function playAudio() {
  click.play();
}
buttons = document.getElementsByClassName("mc-button");

function generateEmojiSummary(matchmap) {

    let emojiSummary = [
        ["⬜", "⬜", "⬜"],
        ["⬜", "⬜", "⬜"],
        ["⬜", "⬜", "⬜"]
    ];

    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (matchmap[i][j] == 2) emojiSummary[i][j] = "🟩";
            else if (matchmap[i][j] == 3) emojiSummary[i][j] = "🟨";
        }
    }
    return emojiSummary;
}

/**
 * Set cursor image to match cursorItem
 */
function setCursor(item) {
    setSlotBackground(cursor, item);
}

function updateRemainingGuesses() {
    document.getElementById("guess-counter").innerText = guessCount+1
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
                console.log("Picked up " + cursorItem)
            } else {
                
                let temp = (cursorItem === null) ? null : cursorItem.slice();
                cursorItem = craftingTables[tableNum][slot["row"]][slot["col"]];
                craftingTables[tableNum][slot["row"]][slot["col"]] = temp;
                
                setSlotBackground(imageDiv, temp);
                
                console.log("Placed " + temp + " in position " + slot["row"] + " " + slot["col"] + " in table " + tableNum)
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
        emojiSummaries.push(generateEmojiSummary(isCorrect[1]));
        if (isCorrect[0]) {
            console.log(solution_item + "solution item");
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
            winner();
        } 
        else if (guessCount < maxGuesses) {
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
            addNewCraftingTable();
        }
        if (guessCount >= maxGuesses) {
            loser()
            return
        }

        var lockedtable = document.getElementById("tablenumber" + tableNum);
        lockedtable.replaceWith(lockedtable.cloneNode(true));
        var solutiondiv = document.getElementById("solutiondiv" + tableNum);
        solutiondiv.classList.add("lockedslot");
        solutiondiv.classList.remove("slot");
        solutiondiv.replaceWith(solutiondiv.cloneNode(true));
        
        updateRemainingGuesses();
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
});

// Check for dropping item if placed outside important divs.
let ingredientsDiv = document.getElementById("ingredients");
let guessesDiv = document.getElementById("guesses");
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

function generateSummary() {
    let summaryString = "Minecraftle " + new Date().toISOString().slice(0, 10) + "\n";
    for (let emojiSummary of emojiSummaries) {
        for (let row of emojiSummary) {
            summaryString += row.join("") + "\n";

        }
        summaryString += "\n"
    }
    return summaryString;

}

function addToClipboard(text) {
    navigator.clipboard.writeText(text);
}

//Function for on win
function winner() {
    document.getElementById("popup").style = "visibility: visible;";
    document.getElementById("popupContainer").style = "visibility: visible;";
    let summary = generateSummary();
    let winnerMessage = "You won! Took " + (guessCount) + " guesses.\n" + summary;
    console.log(winnerMessage);
    document.getElementById("popupContent").textContent = winnerMessage;
    document.getElementById("popupStatsButton").onclick = function(){
        window.location.replace("/stats/"+user_id+"?win="+1+"&attempts="+(guessCount));
    }
    document.getElementById("popupCopyButton").onclick = function(){
        addToClipboard(summary)
    }
    
    
    /**
    console.log("winner");
    setTimeout(()=>{
        let summary = generateSummary();
        alert("You won! Took " + (guessCount) + " guesses.\n" + summary);
        window.location.replace("/stats/"+user_id+"?win="+1+"&attempts="+guessCount);
        addToClipboard(summary)
    }, 1500); */
}

//function on lose
function loser() {
    document.getElementById("popup").style = "visibility: visible;";
    document.getElementById("popupContainer").style = "visibility: visible;";
    let summary = generateSummary();
    let loserMessage = "You lost!  The solution was " + solution_item + "\n" + summary;
    document.getElementById("popupContent").textContent = loserMessage;

    document.getElementById("popupStatsButton").onclick = function(){
        window.location.replace("/stats/"+user_id+"?win="+0+"&attempts="+(guessCount));
    }
    
    document.getElementById("popupCopyButton").onclick = function(){
        addToClipboard(summary)
    }
    
    /** 
    console.log("loser");
    setTimeout(()=>{
        let summary = generateSummary();
        alert("You lost!  The solution was " + solution_item + "\n" + summary);
        window.location.replace("/stats/"+user_id+"?win="+0+"&attempts="+guessCount);
        addToClipboard(summary)
    }, 1500); */
}


