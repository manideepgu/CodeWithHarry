const benText=document.querySelector("#convertedText")
const engText = document.getElementById("textArea");

import { findBengMatch } from "./help.js";
import { buildSuggestions, buildSuggestionsVer2 } from "./suggestionBox.js";
import { textToArray, isAlphabet } from "./keyboard.js";
import { showConvertedData} from "./convertedText.js";
import { setConfirmedBenSubWord, setEngTextForBengWord } from "./memory.js";


// let benData=[];
let benMatch="";
let textArray=[];
let lastEntry="";
let previousKey="";


async function getBenTextArrayFromEngTextArray(engTextArray){
    let benData=textToArray(benText.textContent);
    console.log("Ben Text Array ==>",benData)
    if(engTextArray.length>0){
        // console.log("Eng Text Array is not blank",benData)
        let lastTypedEngWord=engTextArray[engTextArray.length-1];
        let lastTypedEngChar=lastTypedEngWord.slice(-1);
        // console.log("Eng Text Array is not blank",lastTypedEngChar)
        if(engTextArray.length>=benData.length){
            if(isAlphabet(lastTypedEngChar)=="alphabet"){
                if((benData.length==0)||(engTextArray.length>benData.length)){
                    benData.push(await findBengMatch(lastTypedEngWord))
                } else{
                    benData[benData.length-1]=await findBengMatch(lastTypedEngWord)
                }
            } else {
                if(isAlphabet(benData[benData.length-1].slice(-1))=="alphabet"){
                    benData.push(engTextArray[engTextArray.length-1]);
                } else {
                    benData[benData.length-1]=engTextArray[engTextArray.length-1]
                }
            }
        } else {
            benData.pop();
        }
    } else {
        benData=[];
    }
    console.log("Bengali converted Text", benData)
    showConvertedData(benData)
    setEngTextForBengWord(engTextArray[engTextArray.length-1])
    setConfirmedBenSubWord(benData[benData.length-1])
}

// engText.addEventListener("keyup",(e)=>{
//     console.log("KEY IS UP   --->>>> ", e.key)
//     let benData=textToArray(benText.textContent);
//     let engData=textArray;
//     let benMatch="";
//     console.log("benData ==========",benData)
//     if(isAlphabet(engText.value.slice(-1))=="alphabet"){
//         benMatch=findBengMatch(engData[engData.length-1]);
//     }
//     if(benData.length>0){
//         if(isAlphabet(engText.value.slice(-2))=="alphabet"){
//             console.log("Last character is an alphabet")
//             if(isAlphabet(engText.value.slice(-1))=="alphabet"){
//                 benData[benData.length-1]=benMatch;
//             } else {
//                 benData.push(engData[engData.length-1])
//             }
//         } else {
//             console.log("Last character is not an alphabet")
//             if(isAlphabet(engText.value.slice(-1))=="alphabet"){
//                 benData.push(engData[engData.length-1])
//             } else {
//                 benData[benData.length-1]=benMatch;
//             }
//         }
//     } else {
//         benData.push(benMatch);
//     }

//     // if(engData.length%2==1){
//     //     benMatch=findBengMatch(engData[engData.length-1]);
//     // } else {
//     //     benMatch=engData[engData.length-1];
//     // }
//     // if(benData.length==engData.length){
//     //     benData[benData.length-1]=benMatch;
//     // } else if (benData.length>engData.length){
//     //     benData.pop();
//     // } else{
        
//     // }
//     console.log("benData ==========>",benData)
//     showConvertedData(benData)
// })




engText.addEventListener("keydown",(e)=>{
    // console.log("A key is down.");
    // console.log("Ben Text Array ==>",benText.textContent,"P")
    lastEntry=getLastEntryOfArray(textArray);
    let x=e.key.charCodeAt(0);
    if(e.key.length==1){
        console.log("The key has only one character");
        if ((x >= 65 && x <= 90) || (x >= 97 && x <= 122)){
            console.log("The key is alphabet");
            if(lastEntry=="alphabet"){
                console.log("Last Entry and new entry both are alphabets, so the new alphabet is added to the last alphabet");
                textArray[textArray.length-1]=textArray[textArray.length-1]+e.key;
            }else{
                console.log("Last Entry was not an alphabet but the new entry is an alphabet, so a new array element is created with the new alphabet");
                textArray.push(e.key);
            }
            lastEntry="alphabet"   

        } else {
            console.log("The key is not an alphabet");
            if(lastEntry=="not alphabet"){
                console.log("Last Entry and new entry both are not alphabets, so the new entry is added to the last entry");
                textArray[textArray.length-1]=textArray[textArray.length-1]+e.key;
            }else{
                console.log("Last Entry was an alphabet but the new entry is not an alphabet, so a new array element is created with the new entry");
                textArray.push(e.key);
            }
            lastEntry="not alphabet"
        }
        if(previousKey=="Control"){
            // console.log("Value of Previous Key is ",previousKey)
            let newText="";
            textArray.forEach(element=>{
                newText=newText+element;
            })
            // console.log("new text is --->>>>>",newText)
            text.value=newText;
            previousKey="";
        }
    } else {
        // console.log('The Key has multiple characters');
        if(e.key=="Backspace"){
            // console.log('Backspace key pressed');
            deleteLastElement(textArray);
        } 
        if(e.key=="Control"){
            // console.log("Control is pressed");
            previousKey="Control";
            // console.log("Previous Key is set to Control")
        }
    }
    console.log(textArray)
    buildSuggestionsVer2(textArray);
    getBenTextArrayFromEngTextArray(textArray);    
});

function deleteLastElement(textArray){
    // console.log("Deleting the Last element");
    let length = textArray.length;
    if(length>0){
        // console.log("Array is not empty");
        let lastElement=textArray[length-1];
        if(lastElement.length>1){
            // console.log("The last element of the array has more than one character");
            lastElement=lastElement.slice(0,-1);
            // console.log("The last character in the last element of the array is removed");
            textArray[length-1]=lastElement;
            // setEngTextForBengWord(lastElement);
        } else {
            // console.log("The last element of the array has only one character");
            textArray.pop();
            // setEngTextForBengWord("");
            // console.log("The last element of the array is removed");
        }
    }
}

function createElement(textArray){
    // console.log("Creating a new element inside createElement function");
    arrays.innerHTML="";
    textArray.forEach(element => {
            let elem = document.createElement("div");
            elem.className="arrayBox";
            elem.innerHTML=element;
            arrays.appendChild(elem);
        });
    }

function getLastEntryOfArray(textArray){
    let lastEntry=""
    if(textArray.length>0){
        let lastElementOfTheArray=textArray[textArray.length-1];
        if(lastElementOfTheArray.length>0){
            let lastCharacter=lastElementOfTheArray.slice(-1);
            let lastCharacterCode=lastCharacter.charCodeAt(0);
            if((lastCharacterCode >= 65 && lastCharacterCode <= 90) || (lastCharacterCode >= 97 && lastCharacterCode <= 122)){
                lastEntry="alphabet"
            }else{
                lastEntry="not alphabet"
            }
        }else{
            lastEntry=""
        }
    }else{
        lastEntry=""
    }
    return lastEntry;
}

