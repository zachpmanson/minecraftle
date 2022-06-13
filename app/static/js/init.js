



let items;
let maxGuesses = 10;
let craftingTables = [];
let isTableValid = false;
let cursor = document.getElementById("cursor");
let cursorItem = null;
let givenIngredients;

let emojiSummaries = [];

/**
 * Sets background of given div to given item
 * @param {HTMLElement} div 
 * @param {String} item 
 */
function setSlotBackground(div, item) {
    div.style.backgroundImage = (item === null) ? "none" : "url(" + items[item]["icon"] +")";
}


var click = document.getElementById("audio");
/**
 * Plays minecraft music in the background
 */
function playAudio() {
  click.play();
}
buttons = document.getElementsByClassName("mc-button");

/**
 * Creates an emoji map to summarise the game's guesses as right or wrong
 * and it documents their location
 * @param {Array} matchmap array of guess locations
 * @returns {Array} array full of coloured squares (green and yellow) to represent guesses  
 */
 function generateEmojiSummary(ismatch, matchmap) {

    if (ismatch) {
        return [
            ["🟩", "🟩", "🟩"],
            ["🟩", "🟩", "🟩"],
            ["🟩", "🟩", "🟩"]
        ];
    }

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
 * @param {String} item item to follow cursor 
 */
function setCursor(item) {
    setSlotBackground(cursor, item);
}

/**
 * Updates remaining guesses
 */
function updateRemainingGuesses() {
    document.getElementById("guess-counter").innerText = guessCount+1;
}

/**
 * Create ingredients table from list.  Attaches event listeners to slots.
 */
function initIngredients() {
    let ingredientsList = document.getElementById("ingredientsList");
 
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
    

    
    newTable.appendChild(tableDiv);
    
    let arrowDiv = document.createElement("div");
    arrowDiv.classList.add("arrow");
    let arrow = document.createElement("p");
    arrow.innerText = "→";
    arrowDiv.appendChild(arrow);
    newTable.appendChild(arrowDiv);
    
    let outputDiv = document.createElement("div");
    outputDiv.classList.add("crafting-output");
    let slot = document.createElement("div");
    slot.classList.add("slot");
    let imageDiv = document.createElement("div");
    slot.setAttribute("id", "solutiondiv" + tableNum);
    imageDiv.classList.add("slot-image");
    slot.appendChild(imageDiv);
    
    slot.addEventListener("mousedown", e=>{
        if (!isTableValid) return;

        var isCorrect = processGuess(craftingTables[tableNum]);

        // Update solution div to display the correct item, change slot background and lock table
        console.log(isCorrect[0], isCorrect[1]);
        emojiSummaries.push(generateEmojiSummary(isCorrect[0], isCorrect[1]));
        if (isCorrect[0]) {
            console.log(solution_item + "solution item");
            setSlotBackground(imageDiv, solution_item);
            for (const [index, element] of isCorrect[1].entries()) {
                console.log("index: "+ index+" element: " + element);
                for (let i = 0; i < 3; i++) {
                    if(index === 1) {j = i + 4}
                    else if (index === 2) {j = i + 7}
                    else {j = i + 1}
                    const slot = document.querySelector("#tablenumber" + tableNum + " :nth-child(" + j + ")");
                    console.log(slot, j);
                    slot.classList.add("greenguess");
                    slot.classList.add("lockedslot");
                    slot.classList.remove("slot");
                }
            }
            setTimeout(()=>{winner()}, 750);
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
            setTimeout(()=>{loser()}, 750);
            return;
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
    
    // Generate 9 slots
    for (let i = 0; i < 9; i++) {
        let slot = document.createElement("div");
        slot.setAttribute("id", i);
        slot.classList.add("slot");
        slot["row"] = Math.floor(i/3);
        slot["col"] = i % 3;
        tableDiv.appendChild(slot);
        let imageSlotDiv = document.createElement("div");
        imageSlotDiv.classList.add("slot-image");
        slot.appendChild(imageSlotDiv);

        slot.addEventListener("mousedown", e=>{

            // switch held item and slot item
            if (cursorItem === null) {
                cursorItem = craftingTables[tableNum][slot["row"]][slot["col"]];
                craftingTables[tableNum][slot["row"]][slot["col"]] = null;
                setSlotBackground(imageSlotDiv, null);

                console.log("Placed " + null + " in position " + slot["row"] + " " + slot["col"] + " in table " + tableNum);
                console.log("Picked up " + cursorItem);
            } else {
                
                let temp = (cursorItem === null) ? null : cursorItem.slice();
                cursorItem = craftingTables[tableNum][slot["row"]][slot["col"]];
                craftingTables[tableNum][slot["row"]][slot["col"]] = temp;
                
                setSlotBackground(imageSlotDiv, temp);
                
                console.log("Placed " + temp + " in position " + slot["row"] + " " + slot["col"] + " in table " + tableNum);
                console.log("Picked up " + cursorItem);
            }
            setCursor(cursorItem);
            let checkArrangementData = checkArrangement(craftingTables[tableNum]);
            if (checkArrangementData[0]) {
                isTableValid = true;
                setSlotBackground(imageDiv, checkArrangementData[1]);
            } else {
                isTableValid = false;
                setSlotBackground(imageDiv, null);
            }
        });
    }

    newTable.appendChild(outputDiv);
    document.getElementById("guesses").appendChild(newTable);
}

/**
 * Creates a summary of how the match played out in the form of emoji's
 * @returns {string} all game emoji's grouped together
 */
function generateSummary() {
    let timezone = document.getElementById("timzone");
    let summaryString;
    if (timezone === null) {
        summaryString = "Minecraftle " + new Date().toISOString().slice(0, 10) + " " + guessCount + "/" + maxGuesses + "\n";
    } else {
        // not sure if "en-AU" breaks when timezone is set to other countries
        summaryString = "Minecraftle " + new Date().toLocaleString("en-AU", {timeZone: timezone.innerText}).slice(0, 10)  + " " + guessCount + "/" + maxGuesses + "\n";
    }

    for (let emojiSummary of emojiSummaries) {
        for (let row of emojiSummary) {
            summaryString += row.join("") + "\n";

        }
        summaryString += "\n";
    }
    return summaryString;

}

function sendStats(win, attempts) {
    let request = new XMLHttpRequest();
    request.open("GET", "/api/submitgame?user_id="+user_id+"&win="+win+"&attempts="+attempts);
    request.send();
    request.onload = () => {
        if (request.status === 200) {
            console.log(JSON.parse(request.response));
        } else {
            console.log("Error: " + request.status + " " + request.statusText);
        }
    };
}

const copyToClipboard = str => {
    if (navigator && navigator.clipboard && navigator.clipboard.writeText)
        return navigator.clipboard.writeText(str);
    return Promise.reject('The Clipboard API is not available.');
};

/**
 * Creates a popup window for game summary
 * @param {String} msg 
 * @param {String} summary 
 * @param {String} win 
 */
function createPopup(msg, summary, win) {
    document.getElementById("popup").style = "visibility: visible;";
    setSlotBackground(document.getElementById("popupSlot").firstChild, solution_item);
    document.getElementById("popupContainer").style = "visibility: visible;";
    
    if (window.location.href.includes("random")) {
        document.getElementById("popupContent").textContent = msg + "\nNew Puzzle?";
        document.getElementById("popupCopyButton").children[0].textContent = "Daily"
        document.getElementById("popupCopyButton").onclick = function(){
            window.location.replace("/");
        };
        document.getElementById("popupStatsButton").children[0].textContent = "Random"
        document.getElementById("popupStatsButton").onclick = function(){
            window.location.replace("/?random=True");
        };
    } else {
        document.getElementById("popupContent").textContent = msg+summary;
        document.getElementById("popupStatsButton").onclick = function(){
            window.location.replace("/stats/"+user_id);
        };
        document.getElementById("popupCopyButton").onclick = function(){
            copyToClipboard(summary);
        };

    }  
}

/**
 * Win message
 */
function winner() {        
    let summary = generateSummary();
    let winnerMessage = "You won! Took " + (guessCount) + " guesses.\n";
    createPopup(winnerMessage, summary, 1);
    sendStats(1, guessCount);
}

/**
 * Lose message
 */
function loser() {
    let summary = generateSummary();
    let loserMessage = "You lost!  The solution was " + solution_item + "\n";
    createPopup(loserMessage, summary, 0);
    sendStats(0, guessCount);

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
        console.log("dropping item because outside ingredients " + cursorItem);
        cursorItem = null;
        setCursor(cursorItem);
    }
});

document.addEventListener("mousemove", (e) => {
    cursor.style.left = (e.pageX - 5) + 'px';
    cursor.style.top = (e.pageY - 5) + 'px';
});