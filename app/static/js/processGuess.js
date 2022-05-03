
// Compares matches in two 3x3 tables
function compareTables(table1, table2, matchOnly) {

    // 0 is wrong, 1 is null match, 2 is item match
    let matchmap = [
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0]
    ];
    let matchcount = 0;
    let isFullMatch = true;
    for (let i = 0; i < table1.length; i++) {
        for (let j = 0; j < table1[0].length; j++) {
            
            // if matchOnly arg given
            if (matchOnly !== undefined) {
                // if either do not match matchOnly
                if (table1[i][j] !== matchOnly || table1[i][j] !== matchOnly) {
                    // leave matchmap entry as incorrect
                    continue;
                }
            }
            
            
            if (table1[i][j] === table2[i][j]) {
                if (table1[i][j] === null) {
                    // if match is air
                    matchmap[i][j] = 1;
                } else {
                    // if match is item
                    matchmap[i][j] = 2;
                    matchcount++;
                }  
            } else {
                isFullMatch = false;
            }
        }      
                    
    }

    return [matchmap, matchcount, isFullMatch];
}


/* Takes a recipe and generates all possible correct crafting table arrangements
recipe must be in format:
[
    ["minecraft:planks","minecraft:planks"],
    [null,"minecraft:stick"],
    [null,"minecraft:stick"]
]
 */
function generateVariants(recipe) {
    let height = recipe.length
    let width = recipe[0].length;
    let verticalVariants = 4 - recipe.length;
    let horizontalVariants = 4 - recipe[0].length;

    let variants = []

    for (let i = 0; i < verticalVariants; i++) {
        for (let j = 0; j < horizontalVariants; j++) {
            let currentPermutation = [
                [null, null, null],
                [null, null, null],
                [null, null, null]
            ];

            for (let k = 0; k < height; k++) {
                for (let l = 0; l < width; l++) {
                    currentPermutation[i+k][j+l] = recipe[k][l];
                }
            }
            variants.push(currentPermutation);
        }
    }
    return variants;
}


// Checks if guess matches any permutation
function checkAllVariants(guess, allVariants) {
    let isCorrect = false
    
    allVariants.forEach( (permutation)=>{
        matchData = compareTables(permutation, guess);
        // matchData[2] is boolean isFullMatch
        if (matchData[2]) {
            isCorrect=  true;
        }
    });
    return isCorrect;
}

// guess is 3x3 array of guess
// remainingSolutions is array of 3x3 matrix of remaining valid solutions
function checkRemainingVariants(guess, remainingVariants) {
    
    let matchmaps = [];
    let matchcounts = []
    
    remainingVariants.forEach( (permutation)=>{
        let matchData = compareTables(permutation, guess);

        matchmaps.push(matchData[0]);
        matchcounts.push(matchData[1]);
    });

    return [matchmaps, matchcounts];
}

function findRemainingVariantsIndices(matchmaps, matchcounts) {
    let maxMatchesIndex = matchcounts.indexOf(Math.max(...matchcounts));
    console.log("maxMatchesIndex: " +maxMatchesIndex);
    console.log("maxMatches: " +matchcounts[maxMatchesIndex]);
    console.log(matchmaps[maxMatchesIndex]);

    let correctSlots = compareTables(matchmaps[maxMatchesIndex], matchmaps[maxMatchesIndex], 2)[0];

    let remainingVariantsIndices = []

    matchmaps.forEach( (matchmap, i)=>{
        // mask to only include 2's in matchmaps
        let matchDataToCompare = compareTables(matchmap, matchmap, 2); 
        // compare masked
        let greenSlotOverlapData = compareTables(correctSlots, matchDataToCompare[0])
        
        // if greenSlotOverlap is full match
        if (greenSlotOverlapData[2]) {
            remainingVariantsIndices.push(i);
        }
    });

    console.log("remainingVariantsIndices: ")
    console.log(remainingVariantsIndices)

    return [remainingVariantsIndices, correctSlots];
}

function generateNextGuessStartingTable(guess, correctSlots) {

    let startingTable = [
        [null, null, null],
        [null, null, null],
        [null, null, null]
    ];
    for (let i = 0; i < guess.length; i++) {
        for (let j = 0; j < guess[0].length; j++) {
            if (correctSlots[i][j] === 2) {
                startingTable[i][j] = guess[i][j];
            }
        }
    }

    return startingTable;


}


let remainingVariants = [];
let allVariants = [];

let recipe = [
    ["minecraft:planks","minecraft:planks"],
    [null,"minecraft:stick"],
    [null,"minecraft:stick"]
];
let recipe2 = [
    ["minecraft:coal"],
    ["minecraft:stick"]
]

let guesses = [
    [
        [null, null, null],
        [null, "minecraft:stick", null],
        [null, "minecraft:stick", null]
    ],
    [
        [null, "minecraft:planks", null],
        [null, "minecraft:stick", null],
        [null, "minecraft:stick", null]
    ],
    [
        ["minecraft:planks", "minecraft:planks", null],
        ["minecraft:planks", "minecraft:stick", null],
        [null, "minecraft:stick", null]
    ],
    [
        ["minecraft:planks", "minecraft:planks", null],
        [null, "minecraft:stick", null],
        [null, "minecraft:stick", null]
    ]
]


allVariants = allVariants.concat(generateVariants(recipe));
remainingVariants = remainingVariants.concat(generateVariants(recipe));
// Account for horizontal reflection
recipe[0].reverse();
recipe[1].reverse();
recipe[2].reverse();
allVariants = allVariants.concat(generateVariants(recipe));
remainingVariants = remainingVariants.concat(generateVariants(recipe));

let maxGuesses = 4;
for (let guessNum = 0; guessNum < maxGuesses; guessNum++) {
    console.log("GUESS: " + guessNum)
    console.log("checkAllVariants: " + checkAllVariants(guesses[guessNum], allVariants));
    
    let remainingMatchData = checkRemainingVariants(guesses[guessNum], remainingVariants);
    
    let remainingVariantsData = findRemainingVariantsIndices(remainingMatchData[0], remainingMatchData[1]);
    
    let remainingVariantsIndices = remainingVariantsData[0];
    let correctSlots = remainingVariantsData[1];

    let cleanedVariants = []

    console.log("remaining variants after comparing to guess 1:")
    remainingVariantsIndices.forEach((variantIndex)=>{
        cleanedVariants.push(remainingVariants[variantIndex]);
        console.log(remainingVariants[variantIndex]);
    });

    remainingVariants = cleanedVariants;


    console.log("correctSlots:")
    console.log(correctSlots)

    startingTable = generateNextGuessStartingTable(guesses[guessNum], correctSlots);
    console.log("startingTable:")
    console.log(startingTable)

}






