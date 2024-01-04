const typedText = document.getElementById("type");
const combinationEl = document.querySelector(".combinations");
typedText.addEventListener("keyup", (e) => {
    console.log("Text is being typed")
    let text = typedText.value;
    console.log("The Text Typed is: ", text)
    let combinations = [];
    let lengthOfWord = text.length;
    let success = true;
    let item = [text]
    combinations.push(item);

    for (let numberOfGaps = 1; numberOfGaps < lengthOfWord; numberOfGaps++) {
        let gapLocation = [];
        console.log("For loop started for number of gaps = ", numberOfGaps)
        for (let location = 0; location < numberOfGaps; location++) {
            gapLocation[location] = location + 1;
        }
        console.log("gapLocation are: ", gapLocation);
        let i = 0;
        success = true
        while (success) {
            item = [];
            success = false
            console.log("Filling up the items Array as per gap locations");
            for (let iter = 0; iter < gapLocation.length; iter++) {
                if (iter == 0) {
                    item.push(text.slice(0, gapLocation[0]))
                } else {
                    item.push(text.slice(gapLocation[iter - 1], gapLocation[iter]))
                }
            }
            item.push(text.slice(gapLocation[gapLocation.length - 1]))
            console.log("The item array is: ", item);
            combinations.push(item)
            for (let iter = gapLocation.length - 1; iter >= 0; iter--) {
                if (gapLocation[iter] < text.length + iter - numberOfGaps) {
                    console.log(`LOGS----- iter = ${iter}, gapLocation[iter] = ${gapLocation[iter]}`);
                    gapLocation[iter] = gapLocation[iter] + 1;
                    if (gapLocation[iter] < text.length + iter - numberOfGaps) {
                        console.log("Revisiting the forward gaps")
                        for (let i = iter + 1; i < gapLocation.length; i++) {
                            gapLocation[i] = gapLocation[iter] + i - iter;
                        }
                    }
                    console.log("New gapLocation is: ", gapLocation);
                    success = true
                    break;
                }
            }
        }
        console.log("The combinations array is: ", combinations);
    }
    showCombinations(combinations);
}
)

function showCombinations(combinations){
    combinationEl.innerHTML = "";
    combinations.forEach(element => {
        let newRows = document.createElement("div");
        newRows.className = "rows";
        element.forEach(bits => {
            let newItems = document.createElement("div");
            newItems.className = "items";
            newItems.innerHTML = bits;
            newRows.appendChild(newItems);
        })
        combinationEl.appendChild(newRows);
    })
}