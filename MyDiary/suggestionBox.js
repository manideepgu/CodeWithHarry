const suggestionBox=document.querySelector("#suggestionBox");

import { searchAllBengWords } from "./help.js";
import { getConfirmedBenSubWord,setConfirmedBenSubWord, getEngTextForBengWord, setEngTextForBengWord } from "./memory.js";

async function buildSuggestions(textArray){
    let suggestions=[];
    if(textArray.length>0){
        let currentWord=textArray[textArray.length-1]
        let combinations = getAllCombinationsOfFullEngText(currentWord);
        // console.log("The Suggestion combinations are .....", combinations)
        suggestions=await getSuggestionWithoutBlanksAndDuplicates(combinations)
        // console.log("The refined suggestions are .....", suggestions)           
    }
    showSuggestions(suggestions);
}

function getAllCombinationsOfFullEngText(text){
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
    return(combinations);
}

async function getSuggestions(combinations){
    console.log("INSIDE GET SUGGESTIONS");
    let suggestions=[];
    console.log(combinations);   
    for(let i=0;i<combinations.length;i++){ 
        let eachCombination=combinations[i];
        let finalSuggestion=[];
        for(let i=0;i<eachCombination.length;i++){
            let eachCombinationElement=eachCombination[i];
            console.log("Looping through each Element of the combination ",eachCombination);
            let item=[];
            let suggestionsForElement=await searchAllBengWords(eachCombinationElement)
            console.log(`Bengali Suggestion Array for the Element ${eachCombinationElement} is ${JSON.stringify(suggestionsForElement)}`);
            if(suggestionsForElement.length==0){
                finalSuggestion=[];
                break;
            }
            suggestionsForElement.forEach(eachSuggestionForElement=>{
                let newItem=[];
                console.log("Looping through suggestion Arrays. Working with suggestion ", JSON.stringify(eachSuggestionForElement));   
                if(finalSuggestion.length==0){
                    newItem.push(eachSuggestionForElement["bengali"])
                } else {
                    for(let iter=0;iter<finalSuggestion.length;iter++){
                        newItem.push(finalSuggestion[iter]+eachSuggestionForElement["bengali"])
                        console.log("Looping through the Suggestion Array and adding to new Item", newItem);   
                    }
                }
                console.log(`item = ${item} & newItem = ${newItem}`);
               
                newItem.forEach(eachItem=>{
                    item.push(eachItem);
                })
                console.log(`item = ${item} after adding the newItem`);
            });
           finalSuggestion=item;
           console.log(`finalSuggestion = ${finalSuggestion}`); 
        };
        suggestions.push(finalSuggestion);
        console.log(`After adding suggestions in finalSuggestion = ${suggestions}`); 
    }
    console.log("Suggestions: ",suggestions);
    return suggestions
}

async function getSuggestionWithoutBlanksAndDuplicates(combinations){
    console.log("INSIDE getSuggestionWithoutBlankAndDuplicates....")
    let suggestions=await getSuggestions(combinations)
    
    let flattened = flattenArray(suggestions);
    
    console.log("FLATTENNED SUGGESTIONS: ",flattened);

    let suggestionWithoutBlanksAndDuplicates=[];
    for(let i=0;i<flattened.length;i++){
        let isDuplicate=false;
        if(flattened[i]!=""){
            for(let x=0;x<suggestionWithoutBlanksAndDuplicates.length;x++){
                if(flattened[i]==suggestionWithoutBlanksAndDuplicates[x]){
                    isDuplicate=true;
                }
            }
            if(isDuplicate==false){
                suggestionWithoutBlanksAndDuplicates.push(flattened[i]);
            }
        }
    }
    return suggestionWithoutBlanksAndDuplicates;
}

function flattenArray(suggestions){
    let flattened = [];
    for(let i=0;i<suggestions.length;i++){
        if(Array.isArray(suggestions[i])){
            flattened.push(...flattenArray(suggestions[i]));
        } else {
            flattened.push(suggestions[i])
        }
    }
    return flattened;
}

function showSuggestions(suggestions,currentWord){
    suggestionBox.innerHTML="";
    suggestions.forEach(eachSuggestion=>{
        let newSuggestion = document.createElement("div");
        newSuggestion.className="suggests";
        newSuggestion.innerHTML=eachSuggestion;
        newSuggestion.addEventListener("click",()=>{
            let text=document.getElementsByClassName("convertedWord");
            console.log(text[text.length-1]);
            text[text.length-1].innerHTML=eachSuggestion;
            setConfirmedBenSubWord(eachSuggestion);
            setEngTextForBengWord(currentWord)
        })
        suggestionBox.appendChild(newSuggestion);
    })
}

async function buildSuggestionsVer2(textArray){
    let suggestions=[];
    let confirmedSuggestion = []
        
    let confirmedBenSubWord=getConfirmedBenSubWord();
    let confirmedEngTestForBenSubWord=getEngTextForBengWord();
    console.log("confirmedBenSubWord: ",confirmedBenSubWord)
    console.log("confirmedEngTestForBenSubWord: ",confirmedEngTestForBenSubWord)
    
    let currentWord=textArray[textArray.length-1]
    let balanceText=currentWord.replace(confirmedEngTestForBenSubWord,"");
    console.log("balanceText: ",balanceText)

    if(balanceText.length>0){
        console.log("Length of balance Text is above 0: ",balanceText)
        let combinations = getAllCombinationsOfFullEngText(balanceText);
        // console.log("The Suggestion combinations are .....", combinations)
        suggestions=await getSuggestionWithoutBlanksAndDuplicates(combinations)
        console.log("The refined suggestions are .....", suggestions)       
        suggestions.forEach((element)=>{
            confirmedSuggestion.push(confirmedBenSubWord+element)
            console.log("confirmedBenSubWord: ",confirmedBenSubWord)
            console.log("element: ",element)
        })    
    }
    showSuggestions(confirmedSuggestion,currentWord);
}

export {buildSuggestions, buildSuggestionsVer2}