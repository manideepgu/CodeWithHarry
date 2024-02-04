const suggestionBox = document.querySelector("#suggestionBox");

import { searchAllBengWords } from "./help.js";
import {
    getConfirmedBenSubWord, setConfirmedBenSubWord,
    getEngTextForBengWord, setEngTextForBengWord,
    getBenTextArray, setBenTextArray, setEngTextArray
} from "./memory.js";
import { showConvertedData } from "./convertedText.js";

async function buildSuggestions(textArray) {
    console.log("Inside buildSuggestions function ........................")
    //Text Array format: =[[a,m,a,r],[b,e,sh],[bh,a,l,o],[l,a,g,ch,e]]
    console.log("Within buildSuggestions(): textArray=",JSON.stringify(textArray))
    let suggestions = [];
    // let currentWord = textArray[textArray.length - 1]
    if (textArray.length > 0) {
        suggestions = await getSuggestionsWithNewChar(textArray);
        console.log("The Suggestion combinations are .....", JSON.stringify(suggestions))
        // suggestions = await getSuggestionWithoutBlanksAndDuplicates(combinations)
        // console.log("The refined suggestions are .....", suggestions)           
    }
    // suggestions=completeWordsFromSuggestions
    showSuggestions(suggestions);
    updateBenData(textArray,suggestions)
    console.log("Exiting buildSuggestions function ........................")
    return suggestions;
}

async function getSuggestionsWithNewChar(textArray) {
    console.log("Inside getSuggestionsWithNewChar() function ........................")
    let benText = getBenTextArray();
    //benTest=[[a,m,a,r],[b,e,sh],[bh,a,l,o],[l,a,g,ch]]
    let suggests = [];
    //suggests format: [{"english": [[a][m][a][r]], "bengali": [[a][m][a][r]], "use": 3},{"english": [[t][o][m][a][r]], "bengali": [[t][o][m][a][r]], "use": 4}]
    //Text Array format: =[[a,m,a,r],[b,e,sh],[bh,a,l,o],[l,a,g,ch,e]]
    console.log("Within getSuggestionsWithNewChar(): textArray= ",JSON.stringify(textArray),"bentext= ",JSON.stringify(benText));
    let currentEngWord = textArray[textArray.length - 1]
    //currenEngWord format: [l,a,g,ch,e]
    console.log("Within getSuggestionsWithNewChar(): currentEngWord= ",JSON.stringify(currentEngWord));
    let currentBenWord=[];
    // console.log(`Within getSuggestionsWithNewChar(): textArray= ${textArray}, bentext= ${benText}`);
    if(textArray.length==benText.length){
        currentBenWord = [...benText[benText.length-1]];
        //currentBenWord: [l,a,g,ch]
        console.log("Within getSuggestionsWithNewChar(): current Ben Word",JSON.stringify(currentBenWord));
        if (currentEngWord.length > 1) {
            console.log("Within getSuggestionsWithNewChar(): currentBenWord=",JSON.stringify(currentBenWord));
            suggests = await getSuggestionsWithLastTwoElements(currentEngWord, currentBenWord);
            console.log("Within getSuggestionsWithNewChar(): getSuggestionsWithLastTwoElements 1",JSON.stringify(suggests));
        }
        currentBenWord = [...benText[benText.length-1]];
        console.log("Within getSuggestionsWithNewChar(): currentBenWord=",JSON.stringify(currentBenWord));
        suggests = suggests.concat(await getSuggestionsWithOnlyLastChar(currentEngWord, currentBenWord));
        console.log("Within getSuggestionsWithNewChar(): getSuggestionsWithLastTwoElements 2",JSON.stringify(suggests));
            
    }else{
        suggests=await getSuggestionsWithOnlyLastChar(currentEngWord,currentBenWord);
        console.log("Within getSuggestionsWithNewChar(): getSuggestionsWithLastTwoElements 2",JSON.stringify(suggests));
    }
    console.log("Within getSuggestionsWithNewChar(): Suggestions before removal of duplicates",JSON.stringify(suggests));
    suggests=removeDuplicates(suggests);
    suggests = sortSuggestions(suggests);
    console.log("Within getSuggestionsWithNewChar(): Final processed Suggestions ",JSON.stringify(suggests));
    console.log("Exiting getSuggestionsWithNewChar() function ........................")
    return suggests
}

async function getSuggestionsWithOnlyLastChar(currentEngWord,currentBenWord) {
    console.log("Inside getSuggestionsWithOnlyLastChar() function ........................")
    //currenEngWord format: [l,a,g,ch,e]
    //currentBenWord format: [l,a,g,ch]
    let suggests=[];
    let newChar = currentEngWord[currentEngWord.length - 1];
    //newChar format: 'e'
    console.log("New Character =>>",newChar)
    console.log("currentEngWord =>>",JSON.stringify(currentEngWord))
    console.log("currentBenWord =>>",JSON.stringify(currentBenWord))
    let suggestionsForElement = await searchAllBengWords(newChar);
    //suggestionForElement format:  [{"english": 'e', "bengali": 'e', "use": 3},{"english": 'e', "bengali": 'e', "use": 4}]

    console.log("Checking the Suggestions =>>",JSON.stringify(suggestionsForElement))

    suggestionsForElement.forEach(element => {
        console.log("Bengali Element =>>",JSON.stringify(element["bengali"]))
        //element["bengali"] = 'e'
        let newEnglish=[...currentEngWord];
        //newEnglish format: [l,a,g,ch,e]
        let newBengali=[...currentBenWord];
        //newBengali format: [l,a,g,ch]
        console.log("New Bengali Element =>>",JSON.stringify(newBengali))
        // newBengali=currentBenWord;
        newBengali.push(element["bengali"]);
        
        console.log("Bengali Element pushed=>>",JSON.stringify(newBengali))
        //newEnglish format: [l,a,g,ch,e]
        let newUse=element["use"]
        let newObj={
            "english":  newEnglish,
            "bengali":  newBengali,
            "use":      newUse
        };
        suggests.push(newObj)
        //suggests format:  [{"english": [l,a,g,ch,e], "bengali": [l,a,g,ch,e], "use": 3},{"english": [l,a,g,ch,e], "bengali": [l,a,g,ch,e], "use": 4}]
        console.log("Suggests   =>>",JSON.stringify(suggests))
    })
    
    console.log("getSuggestionsWithOnlyLastChar --> ", JSON.stringify(suggests))
    console.log("EXITING FUNCTION XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXgetSuggestionsWithOnlyLastChar()")
    return suggests;
}

async function getSuggestionsWithLastTwoElements(currentEngWord,currentBenWord) {
    console.log("Inside getSuggestionsWithLastTwoElements() function ........................")
    //
    let lastTwoEngChars = currentEngWord[currentEngWord.length - 2] + currentEngWord[currentEngWord.length - 1];
    console.log("lastTwoEngChars --> ", lastTwoEngChars)
    let suggestionsForElement = await searchAllBengWords(lastTwoEngChars);
    console.log("current Ben Word --> ", JSON.stringify(currentBenWord))
    // currentBenWord=currentBenWord[currentBenWord.length-1];
    currentBenWord.pop();
    console.log("current Ben Word --> ", JSON.stringify(currentBenWord))
    console.log("getSuggestionsWithLastTwoChar --> ", JSON.stringify(suggestionsForElement))
    suggestionsForElement.forEach(element=>{
        let newBengali=[...currentBenWord];
        console.log("element[english] >>", element["english"])
        let newEnglish=[...currentEngWord];
        console.log("Checking Value of newEnglish element BEFORE >>", JSON.stringify(newEnglish))
        newEnglish.splice(newEnglish.length-2,2);
        newEnglish.push(element["english"])
        console.log("Checking Value of newEnglish element After >>", JSON.stringify(newEnglish))
        element["english"]=newEnglish;
        console.log("Checking Value of English element AFTER >>", JSON.stringify(element["english"]))
        
        // let lastBenWord=currentBenWord[currentBenWord.length-1];
        console.log("currentBenWord -->>",JSON.stringify(newBengali));
        newBengali.push(element["bengali"]);
        element["bengali"]=[...newBengali]
        console.log("Element [Bengali] -->>",JSON.stringify(element["bengali"]));
        console.log("Element ============================= -->>",JSON.stringify(element));
    })
    console.log("getSuggestionsWithLastTwoElements --> ", JSON.stringify(suggestionsForElement))
    console.log("EXITING FUNCTION XXXXXXXXXX getSuggestionsWithLastTwoElements")
    return (suggestionsForElement);
}

function removeDuplicates(suggests) {
    let cleanSuggests = [];
    console.log("Starting to remove duplicates ", suggests);
    for (let i = 0; i < suggests.length; i++) {
        let suggestion = suggests[i]
        let isPresent = false;
        if (cleanSuggests.length > 0) {
            // console.log("Clean Suggests greater than 0 ");
            cleanSuggests.forEach(element => {
                if ((JSON.stringify(element["english"]) == JSON.stringify(suggestion["english"])) && (JSON.stringify(element["bengali"]) == JSON.stringify(suggestion["bengali"]))) {
                    isPresent = true;
                    if (suggestion["use"] > element["use"]) {
                        element["use"] = suggestion["use"];
                    }
                }
                // console.log("cleanSuggests Iteration:   ",cleanSuggests);
            })
        }
        if (!isPresent) {
            cleanSuggests.push(suggests[i])
            console.log("Present Clean Suggests:: ", cleanSuggests);
        }
    }
    console.log("cleanSuggests:   ", cleanSuggests);
    return cleanSuggests;
}

function compareArray(a,b){
    let result=JSON.stringify(a)==JSON.stringify(b);
    return result;
}

function sortSuggestions(suggests) {
    let testUse = 0;
    let isSorted = false;
    let sortedSuggests = []

    while (!isSorted) {
        suggests.forEach(element => {
            if (element["use"] == testUse) {
                sortedSuggests.push(element)
            }
        })
        if (suggests.length == sortedSuggests.length) {
            isSorted = true;
        }
        testUse++;
    }
    console.log("sortedSuggests ==>", sortedSuggests)
    sortedSuggests = sortedSuggests.reverse();
    return sortedSuggests
}

function updateBenData(textArray, suggestions) {
    console.log("##############INSIDE updateBenData function##########################")
    let mainSuggest = suggestions[0];
    let benDataArray = getBenTextArray();
    console.log("Within updateBenData: benDataArray ==>", JSON.stringify(benDataArray))
    console.log("Within updateBenData: mainSuggest ==>", JSON.stringify(mainSuggest))
    let benSuggestedWord=mainSuggest["bengali"]
    let benSuggestedChar=benSuggestedWord[benSuggestedWord.length-1];
    if(benDataArray.length>0){
        console.log("benDataArray length is greater than 0")
        console.log("Within updateBenData: mainSuggest[english] ==>", JSON.stringify(mainSuggest["english"]))
        if(mainSuggest["english"].length>1){
            //when the last two character elements are combined
            console.log("mainSuggest[english] is greater than 1")
            let lastWord = benDataArray[benDataArray.length-1]
            console.log("Within updateBenData: lastWord ==>", JSON.stringify(lastWord))
            lastWord[lastWord.length-1]=mainSuggest["bengali"]
            console.log("Within updateBenData: lastWord ==>", JSON.stringify(lastWord))
            benDataArray[benDataArray.length-1]=lastWord;
            console.log("Within updateBenData: benDataArray ==>", JSON.stringify(benDataArray))
            let lastEngWord=textArray[textArray.length-1]
            console.log("Within updateBenData: lastEngWord ==>", JSON.stringify(lastEngWord))
            lastEngWord.pop();
            console.log("Within updateBenData: lastEngWord ==>", JSON.stringify(lastEngWord))
            lastEngWord[lastEngWord.length-1]=mainSuggest["english"]
            console.log("Within updateBenData: lastEngWord ==>", JSON.stringify(lastEngWord))
        }else{
            //when a single element is added
            console.log("mainSuggest[english] is lesser than equal to 1")
            if(textArray.length>benDataArray.length){
                //when new word is added to the array
                console.log("Length of englishTextArray is greater than length of BengDataArray")
                console.log("Within updateBenData: benDataArray ==>", JSON.stringify(benDataArray))
                benDataArray.push([mainSuggest["bengali"]])
                console.log("Within updateBenData: benDataArray after adding the main suggestion ==>", JSON.stringify(benDataArray))
            } else {
                console.log("Length of englishTextArray is equal to length of BengDataArray")
                //when one single element is added to the last word only
                console.log("Within updateBenData: benDataArray ==>", JSON.stringify(benDataArray))
                let lastWord = benDataArray[benDataArray.length-1]
                console.log("Within updateBenData: lastWord ==>", JSON.stringify(lastWord))
                console.log("Within updateBenData: mainSuggest[bengali] ==>", JSON.stringify(mainSuggest["bengali"]))
                if(benSuggestedChar.length>1){
                    console.log("Within updateBenData: Length of mainSuggest[bengali] is greater than 1",mainSuggest["bengali"])    
                    lastWord.pop();
                    console.log("Within updateBenData: lastWord after removal of last element",lastWord)    
                }
                lastWord.push(mainSuggest["bengali"][0])
                console.log("Within updateBenData: lastWord after adding suggestion ==>", JSON.stringify(lastWord))
                benDataArray[benDataArray.length-1]=lastWord;
                console.log("Within updateBenData: benDataArray ==>", JSON.stringify(benDataArray))
            }
        }
    } else {
        //When benData is blank
        console.log("benDataArray is 0")
        console.log("Within updateBenData: benDataArray ==>", JSON.stringify(benDataArray))
        benDataArray.push([mainSuggest["bengali"]])
        console.log("Within updateBenData: benDataArray ==>", JSON.stringify(benDataArray))
    }
    setEngTextArray(textArray);
    showConvertedData(benDataArray)
    setBenTextArray(benDataArray);
    console.log("XXXXXXXXXXXXXXXXXXXXXXXXxEXITING updateBenData functionXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX")
}


function getAllCombinationsOfFullEngText(text) {
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
    return (combinations);
}

async function getSuggestions(combinations) {
    console.log("INSIDE GET SUGGESTIONS");
    let suggestions = [];
    console.log(combinations);
    for (let i = 0; i < combinations.length; i++) {
        let eachCombination = combinations[i];
        let finalSuggestion = [];
        for (let i = 0; i < eachCombination.length; i++) {
            let eachCombinationElement = eachCombination[i];
            console.log("Looping through each Element of the combination ", eachCombination);
            let item = [];
            let suggestionsForElement = await searchAllBengWords(eachCombinationElement)
            console.log(`Bengali Suggestion Array for the Element ${eachCombinationElement} is ${JSON.stringify(suggestionsForElement)}`);
            if (suggestionsForElement.length == 0) {
                finalSuggestion = [];
                break;
            }
            suggestionsForElement.forEach(eachSuggestionForElement => {
                let newItem = [];
                console.log("Looping through suggestion Arrays. Working with suggestion ", JSON.stringify(eachSuggestionForElement));
                if (finalSuggestion.length == 0) {
                    newItem.push(eachSuggestionForElement["bengali"])
                } else {
                    for (let iter = 0; iter < finalSuggestion.length; iter++) {
                        newItem.push(finalSuggestion[iter] + eachSuggestionForElement["bengali"])
                        console.log("Looping through the Suggestion Array and adding to new Item", newItem);
                    }
                }
                console.log(`item = ${item} & newItem = ${newItem}`);

                newItem.forEach(eachItem => {
                    item.push(eachItem);
                })
                console.log(`item = ${item} after adding the newItem`);
            });
            finalSuggestion = item;
            console.log(`finalSuggestion = ${finalSuggestion}`);
        };
        suggestions.push(finalSuggestion);
        console.log(`After adding suggestions in finalSuggestion = ${suggestions}`);
    }
    console.log("Suggestions: ", suggestions);
    return suggestions
}

async function getSuggestionWithoutBlanksAndDuplicates(combinations) {
    console.log("INSIDE getSuggestionWithoutBlankAndDuplicates....")
    let suggestions = await getSuggestions(combinations)

    let flattened = flattenArray(suggestions);

    console.log("FLATTENNED SUGGESTIONS: ", flattened);

    let suggestionWithoutBlanksAndDuplicates = [];
    for (let i = 0; i < flattened.length; i++) {
        let isDuplicate = false;
        if (flattened[i] != "") {
            for (let x = 0; x < suggestionWithoutBlanksAndDuplicates.length; x++) {
                if (flattened[i] == suggestionWithoutBlanksAndDuplicates[x]) {
                    isDuplicate = true;
                }
            }
            if (isDuplicate == false) {
                suggestionWithoutBlanksAndDuplicates.push(flattened[i]);
            }
        }
    }
    return suggestionWithoutBlanksAndDuplicates;
}

function flattenArray(suggestions) {
    let flattened = [];
    for (let i = 0; i < suggestions.length; i++) {
        if (Array.isArray(suggestions[i])) {
            flattened.push(...flattenArray(suggestions[i]));
        } else {
            flattened.push(suggestions[i])
        }
    }
    return flattened;
}

function showSuggestions(suggestions) {
    console.log("Within ShowSuggestions", suggestions)
    suggestionBox.innerHTML = "";
    suggestions.forEach(eachSuggestion => {
        let newSuggestion = document.createElement("div");
        newSuggestion.className = "suggests";
        newSuggestion.innerHTML = eachSuggestion["bengali"].join("");
        newSuggestion.addEventListener("click", () => {
            let text = document.getElementsByClassName("convertedWord");
            console.log(text[text.length - 1]);
            text[text.length - 1].innerHTML = eachSuggestion["bengali"];
            setConfirmedBenSubWord(eachSuggestion["bengali"]);
            setEngTextForBengWord(currentWord)
        })
        suggestionBox.appendChild(newSuggestion);
    })
}

async function buildSuggestionsVer2(textArray) {
    let suggestions = [];
    let confirmedSuggestion = []

    let confirmedBenSubWord = getConfirmedBenSubWord();
    let confirmedEngTestForBenSubWord = getEngTextForBengWord();
    console.log("confirmedBenSubWord: ", confirmedBenSubWord)
    console.log("confirmedEngTestForBenSubWord: ", confirmedEngTestForBenSubWord)

    let currentWord = textArray[textArray.length - 1]
    let balanceText = currentWord.replace(confirmedEngTestForBenSubWord, "");
    console.log("balanceText: ", balanceText)

    if (balanceText.length > 0) {
        console.log("Length of balance Text is above 0: ", balanceText)
        let combinations = getAllCombinationsOfFullEngText(balanceText);
        // console.log("The Suggestion combinations are .....", combinations)
        suggestions = await getSuggestionWithoutBlanksAndDuplicates(combinations)
        console.log("The refined suggestions are .....", suggestions)
        suggestions.forEach((element) => {
            confirmedSuggestion.push(confirmedBenSubWord + element)
            console.log("confirmedBenSubWord: ", confirmedBenSubWord)
            console.log("element: ", element)
        })
    }
    showSuggestions(confirmedSuggestion, currentWord);
}

export { buildSuggestions, buildSuggestionsVer2 }