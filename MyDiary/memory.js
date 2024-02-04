let benConfirmedSubWord = "";
let engTextForBengWord = "";

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

export { getConfirmedBenSubWord, setConfirmedBenSubWord, getEngTextForBengWord, setEngTextForBengWord }