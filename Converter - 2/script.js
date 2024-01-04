const convertedData=document.querySelector(".convertedData");
const typeText = document.querySelector("textarea");

import { findBengMatch } from "./help.js";
import { textArray } from "./textArea.js";
import { bengTextToArray } from "./keyboard.js";


let benData=[];
let benMatch="";

typeText.addEventListener("keyup",()=>{
    console.log("benData ==========",bengTextToArray("SAMPLLE FOT"))
    benData=bengTextToArray(convertedData.textContent);
    console.log("benData ==========",benData)
    if(textArray.length%2==1){
        benMatch=findBengMatch(textArray[textArray.length-1]);
    } else {
        benMatch=textArray[textArray.length-1];
    }
    if(benData.length==textArray.length){
        benData[benData.length-1]=benMatch;
    } else if (benData.length>textArray.length){
        benData.pop();
    } else{
        benData.push(benMatch);
    }
    showConvertedData(benData)
})

function showConvertedData(benDataArray){
    convertedData.innerHTML="";
    benDataArray.forEach((element)=>{
        let newConvertedWord=document.createElement("div");
        newConvertedWord.className="convertedWord";
        newConvertedWord.setAttribute("contenteditable",true);
        newConvertedWord.innerHTML=element;
        convertedData.appendChild(newConvertedWord);
    })
}

export {benData, showConvertedData}