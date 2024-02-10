let benConfirmedSubWord = "";
let engTextForBengWord = "";
let engTextArray=[];
let benTextArray=[[]];
let benHistory=[];

function getConfirmedBenSubWord() {
    return benConfirmedSubWord;
}

function setConfirmedBenSubWord(word) {
    benConfirmedSubWord = word;
    console.log("Setting Memory for subWord to: ", benConfirmedSubWord)
}

function getEngTextForBengWord() {
    return engTextForBengWord;
}

function setEngTextForBengWord(text) {
    engTextForBengWord = text;
    console.log("Setting Memory for corresponding english Text to: ", engTextForBengWord)
}

function getEngTextArray() {
    return engTextArray;
}

function setEngTextArray(textArray) {
    engTextArray = textArray;
    console.log("Setting Memory for EngTextArray to: ", JSON.stringify(engTextArray))
}
function getBenTextArray() {
    return benTextArray;
}

function setBenTextArray(textArray) {
    benTextArray = textArray;
    console.log("Setting Memory for benTextArray to: ", JSON.stringify(benTextArray))
}
function getBenHistoryArray() {
    return benHistory;
}

function setBenHistoryArray(textArray) {
    benHistory=[...textArray];
    console.log("Setting Memory for benHistoryArray to: ", JSON.stringify(benHistory))
}
export { getConfirmedBenSubWord, getBenHistoryArray, setBenHistoryArray, setConfirmedBenSubWord, getEngTextForBengWord, setEngTextForBengWord, getEngTextArray, setEngTextArray, getBenTextArray,setBenTextArray}