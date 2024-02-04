
const benText=document.querySelector("#convertedText")
const engText=document.querySelector("#textArea")
const keyboard=document.getElementById("keyboard");

import {basic, banjan} from "./data.mjs";
import { showConvertedData } from "./convertedText.js";
import { setConfirmedBenSubWord } from "./memory.js";

createBengaliKeyboard()

function createBengaliKeyboard(){
    for (let i = 0; i < 80; i++) {
        let char=""
        if(i<basic.length){
            char=basic[i].bengali;
            createNewKey(char);
        }
        else {break;}
    }
}

function createNewKey(char) {
    // console.log("Creating a NEW KEY")
    let newKey = document.createElement('div');
    newKey.addEventListener("click",()=>replaceTheLastCharWithClickedKey(char));
    newKey.className = "keys";
    newKey.innerHTML = char;
    newKey.setAttribute = `${char}`;
    keyboard.appendChild(newKey);
}

function replaceTheLastCharWithClickedKey(char){
    let benData=benText.textContent;
    console.log("ETA BenData???",benData);
    let benDataArray=textToArray(benData)
    let lastWordInArray = benDataArray[benDataArray.length-1];
    let lastWordWithoutFinalCharacter=lastWordInArray.slice(0,-1);
    console.log("last Word without final character",lastWordWithoutFinalCharacter);
    benDataArray.pop();
    console.log(benDataArray);
    benDataArray.push(lastWordWithoutFinalCharacter+char);
    setConfirmedSubWord(lastWordWithoutFinalCharacter+char)
    showConvertedData(benDataArray);
}

function textToArray(dataText){
    console.log("Inside function to convert BenText to Array",dataText);
    let dataArray=[];
    if(dataText.length>0){
        console.log("The BenData is not Empty");
        dataArray.push(dataText[0])
        console.log("First Element Added to the Array: ",dataArray);
        for(let i=1;i<dataText.length;i++){
            let previousCharType=isAlphabet(dataText[i-1]);
            let currentCharType=isAlphabet(dataText[i]);
            console.log("Iteration bnumber: ",i);
            if(previousCharType==currentCharType){
                console.log("_________________________________")
                console.log(dataArray,"    ",dataText)
                console.log(dataArray[dataArray.length-1],"    ",dataText[i])
                console.log("_________________________________")
                dataArray[dataArray.length-1]=dataArray[dataArray.length-1]+dataText[i];
                console.log(`Last element is same as the character in the text. Thus the character is added to the last element. New Array is ${dataArray}`)    
            }else{
                dataArray.push(dataText[i])
                console.log(`Last element is not the same as the character in the text. Thus a new element is added to the array. New Array is ${dataArray}`)
            }
        }
    }
    console.log(dataArray);
    return dataArray;
}

function isAlphabet(char){
    console.log("Executing function isAlphabet()....with  ", char)
    let charCode =char.charCodeAt(0);
    if((charCode >= 65 && charCode <= 90) || (charCode >= 97 && charCode <= 122)||(charCode>126)){
        console.log(`The character ${char} is an alphabet....`)
        return "alphabet";
    }else{
        console.log(`The character ${char} is NOT an alphabet....`)
        return "not alphabet";
    }
}
async function updateFirebaseWithData(engDataArray,benDataArray){
    console.log("Inside Update Firebase Data Function")
    let dictionary = await createFullDictionary();
    console.log(dictionary);
    for(let i=0; i<engDataArray.length;i++){
        console.log("________",engDataArray[i])
        let presentInDictionary=false;
        if(isAlphabet(engDataArray[i])=="alphabet"){
           dictionary.forEach((element)=>{
            console.log(element);
            if((element.english==engDataArray[i])&&(element.bengali==benDataArray[i])){
                presentInDictionary=true;
           }
        });
        
        if(presentInDictionary==true){
            updateDataToFirestore(engDataArray[i],benDataArray[i]); 
        } else {
            addDataToFirestore(engDataArray[i], benDataArray[i])
        }    
        }
    }
}

export {textToArray, isAlphabet};