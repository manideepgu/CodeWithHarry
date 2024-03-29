const benText = document.querySelector("#convertedText")
const engText = document.getElementById("textArea");

import { findBengMatch } from "./help.js";
import { buildSuggestions, buildSuggestionsVer2, flattenArray } from "./suggestionBox.js";
import { textToArray, isAlphabet } from "./keyboard.js";
import { showConvertedData } from "./convertedText.js";
import {
    setConfirmedBenSubWord, setEngTextForBengWord,
    getEngTextArray, setEngTextArray,
    getBenTextArray, setBenTextArray,
    getBenHistoryArray, setBenHistoryArray
}
    from "./memory.js";


// let benData=[];
let lastEntry = "";
let previousKey = "";


async function getBenTextArrayFromEngTextArray(engTextArray) {
    let benData = textToArray(benText.textContent);
    console.log("Ben Text Array ==>", benData)
    if (engTextArray.length > 0) {
        // console.log("Eng Text Array is not blank",benData)
        let lastTypedEngWord = engTextArray[engTextArray.length - 1];
        let lastTypedEngChar = lastTypedEngWord.slice(-1);
        // console.log("Eng Text Array is not blank",lastTypedEngChar)
        if (engTextArray.length >= benData.length) {
            if (isAlphabet(lastTypedEngChar) == "alphabet") {
                if ((benData.length == 0) || (engTextArray.length > benData.length)) {
                    benData.push(await findBengMatch(lastTypedEngWord))
                } else {
                    benData[benData.length - 1] = await findBengMatch(lastTypedEngWord)
                }
            } else {
                if (isAlphabet(benData[benData.length - 1].slice(-1)) == "alphabet") {
                    benData.push(engTextArray[engTextArray.length - 1]);
                } else {
                    benData[benData.length - 1] = engTextArray[engTextArray.length - 1]
                }
            }
        } else {
            benData.pop();
        }
    } else {
        benData = [];
    }
    console.log("Bengali converted Text", benData)
    showConvertedData(benData)
    setEngTextForBengWord(engTextArray[engTextArray.length - 1])
    setConfirmedBenSubWord(benData[benData.length - 1])
}

engText.addEventListener("keydown", async (e) => {
    console.log("---------------------------------A key is down.-------------------------------",e.key);
    // console.log("Ben Text Array ==>",benText.textContent,"P")
    let textArray = getEngTextArray();
    let lengthOfPrevTextArray = flattenArray(textArray).length;
    console.log("Length Of Text Array:-  ",lengthOfPrevTextArray)
    //Text Array format: =[[a,m,a,r],[b,e,sh],[bh,a,l,o],[l,a,g,ch,e]]
    console.log("Inside Type Down Function: textArray ==>",JSON.stringify(textArray))
    lastEntry = getLastEntryOfArray(textArray);
    let benDataArray=getBenTextArray();
    let x = e.key.charCodeAt(0);
    if (e.key.length == 1) {
        // console.log("The key has only one character");
        if ((x >= 65 && x <= 90) || (x >= 97 && x <= 122)) {
            // console.log("The key is alphabet");
            if (lastEntry == "alphabet") {
                // console.log("Last Entry and new entry both are alphabets, so the new alphabet is added to the last alphabet");
                let lastElement=textArray[textArray.length-1];
                lastElement.push(e.key);
                textArray[textArray.length - 1] = lastElement;
            } else {
                // console.log("Last Entry was not an alphabet but the new entry is an alphabet, so a new array element is created with the new alphabet");
                textArray.push([e.key]);
            }
            lastEntry = "alphabet"

        } else {
            // console.log("The key is not an alphabet");
            if (lastEntry == "not alphabet") {
                // console.log("Last Entry and new entry both are not alphabets, so the new entry is added to the last entry");
                let lastElement=textArray[textArray.length-1];
                lastElement.push(e.key);
                textArray[textArray.length - 1] = lastElement;
                // textArray[textArray.length - 1] = textArray[textArray.length - 1].push(e.key);
                // console.log(textArray);
            } else {
                // console.log("Last Entry was an alphabet but the new entry is not an alphabet, so a new array element is created with the new entry");
                textArray.push([e.key]);
            }
            lastEntry = "not alphabet"
        }
        if (previousKey == "Control") {
            // console.log("Value of Previous Key is ",previousKey)
            let newText = "";
            textArray.forEach(element => {
                newText = newText + element;
            })
            // console.log("new text is --->>>>>",newText)
            text.value = newText;
            previousKey = "";
        }
        benDataArray = await buildBenDataFromEngTextArray(textArray);
        console.log("Get Ben Data Array: ",JSON.stringify(benDataArray))
        let benHistory=[...getBenHistoryArray()];
        console.log("Get Ben History Array: ",JSON.stringify(benHistory))
        benHistory.push([...benDataArray]);
        console.log("Setting new Ben History Array: ",JSON.stringify(benHistory))
        setBenHistoryArray([...benHistory]);
    } else {
        // console.log('The Key has multiple characters');
        if (e.key == "Backspace") {
            console.log('Backspace key pressed');
            textArray=deleteLastElement(textArray);
            benDataArray=await getDeletedBenData(textArray)
            await buildBenDataFromEngTextArray(textArray);
        }
        if (e.key == "Control") {
            // console.log("Control is pressed");
            previousKey = "Control";
            // console.log("Previous Key is set to Control")
        }
    }
    console.log("---------- Type Function concluded  -------------")
    // benDataArray = await buildBenDataFromEngTextArray(textArray,lengthOfPrevTextArray);
    console.log("English Text Array",JSON.stringify(textArray))
    
    setEngTextArray(textArray);
    setBenTextArray(benDataArray)
    console.log("Final BenData before showing: ",JSON.stringify(benDataArray))
    showConvertedData(benDataArray)
});


async function buildBenDataFromEngTextArray(textArray){
    console.log("########  INSIDE buildBenDataFromEngTextArray function()   ##########")
    let benDataArray=getBenTextArray();
    lastEntry = getLastEntryOfArray(textArray);
    console.log("Last Entry of the Text Array",JSON.stringify(lastEntry))
    let preferredBenSuggestion="";
    let preferredFullSuggestion="";
        
    if(textArray.length>benDataArray.length){
        //textArray > benDataArray, meaning new character is added
        console.log("Character added for a new Word",JSON.stringify(textArray))
        if (lastEntry=="alphabet"){    
            preferredFullSuggestion=(await buildSuggestions(textArray))[0];
            console.log("Inside Suggestions ==>>",JSON.stringify(preferredFullSuggestion))
            preferredBenSuggestion = preferredFullSuggestion["bengali"]
            console.log("Inside Suggestions ==>>",JSON.stringify(preferredBenSuggestion))
            let lastElemOfpreferredBenSuggestion=preferredBenSuggestion[preferredBenSuggestion.length-1];
            console.log("Inside Suggestions ==>>",JSON.stringify(lastElemOfpreferredBenSuggestion))
            textArray[textArray.length-1]=preferredFullSuggestion["english"]
            console.log("Preferred Ben Suggestions ==>>",JSON.stringify(preferredBenSuggestion))
            // benDataArray.push(preferredBenSuggestion)   
        }else{
            preferredBenSuggestion = textArray[textArray.length-1]
            benDataArray.push(preferredBenSuggestion)
            }
    } else if (textArray.length==benDataArray.length){
        console.log("Character added to an existing word",JSON.stringify(textArray))
        if (lastEntry=="alphabet"){    
            console.log("Last Entry was an alphabet.... ")
            preferredFullSuggestion=(await buildSuggestions(textArray))[0];
            console.log("Inside Suggestions ==>>",JSON.stringify(preferredFullSuggestion))
            preferredBenSuggestion = preferredFullSuggestion["bengali"]
            console.log("Inside Suggestions ==>>",JSON.stringify(preferredBenSuggestion))
            let lastElemOfpreferredBenSuggestion=preferredBenSuggestion[preferredBenSuggestion.length-1];
            console.log("Inside Suggestions ==>>",JSON.stringify(lastElemOfpreferredBenSuggestion))
            textArray[textArray.length-1]=preferredFullSuggestion["english"]
            console.log("Preferred Ben Suggestions ==>>",JSON.stringify(preferredBenSuggestion))
            benDataArray[benDataArray.length-1]=(preferredBenSuggestion)   
        }else{
            preferredBenSuggestion = textArray[textArray.length-1]
            benDataArray[benDataArray.length-1]=preferredBenSuggestion
            }
    }
    console.log("Ben Data Array ==>>",JSON.stringify(benDataArray))
    console.log("XXXXXXXXXXXXXXXXXXXXXXX  EXITING buildBenDataFromEngTextArray function()  XXXXXXXXXx")
    return benDataArray
}

async function getDeletedBenData(textArray){
    console.log("########  INSIDE getDeletedBenData function()   ##########")
    let benDataArray=getBenTextArray();
    console.log("Text Array: ",JSON.stringify(textArray)," benDataArray: ",JSON.stringify(benDataArray))
    let benHistory=[...getBenHistoryArray()];
    console.log("---------------------Ben History: ",JSON.stringify(benHistory))
    benHistory.pop();
    console.log("---------------------Ben History removing last element: ",JSON.stringify(benHistory))
    if(benHistory.length>0){
        benDataArray=[...benHistory[benHistory.length-1]];
    } else {
        benDataArray.pop();
    }
    console.log("---------------------Ben Data Array: ",JSON.stringify(benDataArray))
    console.log("XXXXXXXXXXXXXXXXXXXXXXX  EXITING buildBenDataFromEngTextArray function()  XXXXXXXXXx")
    setBenHistoryArray(benHistory)
    return benDataArray
}

function deleteLastElement(textArray) {
    // console.log("Deleting the Last element");
    let length = textArray.length;
    if (length > 0) {
        // console.log("Array is not empty");
        let lastWord = textArray[length - 1];
        if (lastWord.length > 0) {
            let lastElementInLastWord=lastWord[lastWord.length-1]
            // console.log("The last element of the array has more than one character");
            if(lastElementInLastWord.length>1){
                lastElementInLastWord=lastElementInLastWord.slice(0, -1)
                lastWord[lastWord.length-1]=lastElementInLastWord
            } else {
                lastWord.pop();
                if(lastWord.length==0){
                    textArray.pop();
                }
            }
        }
    }
    return textArray;
}

function createElement(textArray) {
    // console.log("Creating a new element inside createElement function");
    arrays.innerHTML = "";
    textArray.forEach(element => {
        let elem = document.createElement("div");
        elem.className = "arrayBox";
        elem.innerHTML = element;
        arrays.appendChild(elem);
    });
}

function getLastEntryOfArray(textArray) {
    console.log("#################Inside getLastEntryOfArray Function##################")
    console.log("Within getLastEntryOfArray: Text Array ==>>",JSON.stringify(textArray))
    let lastEntry = ""
    if (textArray.length > 0) {
        let lastWordInTheArray = textArray[textArray.length - 1];
        console.log("Within getLastEntryOfArray: lastWordInTheArray ==>>",JSON.stringify(lastWordInTheArray))
        if (lastWordInTheArray.length > 0) {
            console.log("Within getLastEntryOfArray: lastWordInArray is greater than 0 ==>>",JSON.stringify(lastWordInTheArray.length))
            let lastCharacterSet = lastWordInTheArray[lastWordInTheArray.length-1];
            console.log("Within getLastEntryOfArray: lastCharacterSet ==>>",JSON.stringify(lastCharacterSet))
            let lastCharacter=lastCharacterSet.slice(-1);
            console.log("Within getLastEntryOfArray: lastCharacter ==>>",JSON.stringify(lastCharacter))
            // lastCharacter=lastCharacter[lastCharacter.length-1];
            let lastCharacterCode = lastCharacter.charCodeAt(0);
            if ((lastCharacterCode >= 65 && lastCharacterCode <= 90) || (lastCharacterCode >= 97 && lastCharacterCode <= 122)) {
                lastEntry = "alphabet"
            } else {
                lastEntry = "not alphabet"
            }
        } else {
            lastEntry = ""
        }
    } else {
        lastEntry = ""
    }
    console.log("XXXXXXXXXXXXXXXXX  EXITING getLastEntryOfArray Function  XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXx")
    return lastEntry;
}

