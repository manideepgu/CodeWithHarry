const keyBrake = document.getElementsByClassName("break");
const btnSubmit=document.querySelector("#addToFirestore");
const benText=document.querySelector(".convertedData")
const engText=document.querySelector("#type")
const convertedData=document.querySelector(".convertedData")

import {banjan} from "./data.mjs";
import { addDataToFirestore, updateDataToFirestore } from "./firebase.js";
import { benData, showConvertedData } from "./script.js";
import { createFullDictionary } from "./help.js";

createBengaliKeyboard()

function createBengaliKeyboard(){
    for (let i = 0; i < 80; i++) {
        let char=""
        if(i<banjan.length){
            char=banjan[i].bengali;
            createNewKey(char);
        }
        else {break;}
    }
}

function createNewKey(char) {
    console.log("Creating a NEW KEY")
    let newKey = document.createElement('div');
    newKey.addEventListener("click",()=>replaceTheLastCharWithClickedKey(char));
    newKey.className = "keys";
    newKey.innerHTML = char;
    newKey.setAttribute = `${char}`;
    keyBrake[1].appendChild(newKey);
}

function replaceTheLastCharWithClickedKey(char){
    console.log(benData);
    let benDataArray=bengTextToArray(benData)
    let lastWordInArray = benDataArray[benDataArray.length-1];
    let lastWordWithoutFinalCharacter=lastWordInArray.slice(0,-1);
    console.log("last Word without final character",lastWordWithoutFinalCharacter);
    benDataArray.pop();
    console.log(benDataArray);
    benDataArray.push(lastWordWithoutFinalCharacter+char);
    showConvertedData(benDataArray);
}

btnSubmit.addEventListener("click",async ()=>{
    console.log("Button clicked to Add to Firestore")
    
    let benDataText=benText.textContent;
    console.log("The Bengali Text is ",benDataText)
    let benDataArray;
    let engDataText=engText.value;
    console.log("The English Text is ",engDataText)
    let engDataArray;
    
    benDataArray = bengTextToArray(benDataText)
    engDataArray = bengTextToArray(engDataText)
    console.log(`Bengali Array is: ${benDataArray} and English Array is:${engDataArray}`)
    
    updateFirebaseWithData(engDataArray,benDataArray);

});

function bengTextToArray(benDataText){
    console.log("Inside function to convert BenText to Array");
    let benDataArray=[];
    if(benDataText.length>0){
        console.log("The BenData is not Empty");
        benDataArray.push(benDataText[0])
        console.log("First Element Added to the Array: ",benDataArray);
        for(let i=1;i<benDataText.length;i++){
            let previousCharType=isAlphabet(benDataText[i-1]);
            let currentCharType=isAlphabet(benDataText[i]);
            console.log("Iteration bnumber: ",i);
            if(previousCharType==currentCharType){
                console.log("_________________________________")
                console.log(benDataArray,"    ",benDataText)
                console.log(benDataArray[benDataArray.length-1],"    ",benDataText[i])
                console.log("_________________________________")
                benDataArray[benDataArray.length-1]=benDataArray[benDataArray.length-1]+benDataText[i];
                console.log(`Last element is same as the character in the text. Thus the character is added to the last element. New Array is ${benDataArray}`)    
            }else{
                benDataArray.push(benDataText[i])
                console.log(`Last element is not the same as the character in the text. Thus a new element is added to the array. New Array is ${benDataArray}`)
            }
        }
    }
    console.log(benDataArray);
    return benDataArray;
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

export {bengTextToArray};