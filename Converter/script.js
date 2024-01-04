let keyBrake = document.getElementsByClassName("break");
let convertedData=document.querySelector(".convertedData");

const typeText = document.querySelector("textarea");

import { findBengMatch } from "./help.js";
import { textArray } from "./textArea.js";


let benData=[];
let benMatch="";



typeText.addEventListener("keyup",()=>{
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
    convertedData.innerHTML=benData.join("");
})



export {benData}