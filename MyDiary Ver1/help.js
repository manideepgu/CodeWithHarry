const benText=document.querySelector("#convertedText")
const engText = document.getElementById("textArea");

import { banjan } from "./data.mjs";
// import { getDiaryEntryFromFirestore } from "./firebaseDictionary.js";
import { getDictionaryFromFirestore, createFullDictionary, dictionary } from "./firebaseMyDiary.js";
import { isAlphabet, textToArray} from "./keyboard.js";


function findCurrentWord(text){
    let wordsArray=text.split(" ");
    let currentWord=wordsArray[wordsArray.length-1];
    return currentWord;
}

async function findBengMatch(text){
    // let originalWord = findCurrentWord(text);
    let originalWord = text;
    let currentWord=originalWord;
    let bengText="";
    console.log(`Searching start with currentWord = ${currentWord}`)
    while(currentWord!=""){
        console.log(`In the while loop. currentWord = ${currentWord}`)
        let bengWord = searchBengWordWithMostUse(await searchAllBengWords(currentWord));
        if(bengWord==false){
            currentWord=currentWord.slice(0,-1);
            console.log(`Search returned false. currentWord modified to = ${currentWord}`);  
        } else {
            bengText=bengText+bengWord
            currentWord=originalWord.replace(currentWord,"")
            originalWord=currentWord;
            console.log(`Search result returned ${bengText} currentWord = ${currentWord}`)
        }
    }
    return bengText
}

async function searchAllBengWords(word){
    console.log("Inside searchAllBengWords function !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
    console.log("word to be searched in dictionary  ",word);
    // dictionary=await createFullDictionary();
    // console.log(dictionary);
    let searchSuccess=false;
    let result = [];
    dictionary.forEach(element => {
        if(element["english"]===word){
            console.log("Searching the data: ",JSON.stringify(element));
            console.log("Dictionary entry matching subword: ",JSON.stringify(element["english"])," SubWord: ",word);
            console.log("Searching the data: ",element["bengali"]);
            searchSuccess=true;
            result.push(element);
            console.log("Result: ",JSON.stringify(result));
        }
    });
    console.log("Exiting searchAllBengWords function !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!  ",result);
    return result;
}

function searchBengWordWithMostUse(result){
    if(result.length>0){
        let cell=0;
        if (result.length>1){
            for(let iter=1;iter<result.length;iter++){
                if(result[iter-1].use>result[iter].use){
                    cell=iter-1;
                } else {
                    cell=iter;
                }
            }
        }
        return result[cell].bengali;   
    } else {
        return false
    }
}

function getDateInCustomFormat(date){
    
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    
    const weekDay = date.toLocaleDateString("en-US", { weekday: 'long' });

    const formattedDate = `${weekDay} ${day}-${month}-${year}`;
    // console.log(formattedDate);
    return formattedDate;
}

function getDateInDiaryFormat(date){
    
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    
    const weekDay = date.toLocaleDateString("en-US", { weekday: 'long' });

    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");
    const formattedDate = `${weekDay} ${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
    // console.log(formattedDate);
    return formattedDate;
}

function getLastTenDaysInAnArrayInCustomFormat(){
    let formattedDatesInAnArray=[];
    let currentDate = new Date();
    for(let iter=0;iter<20;iter++){
        formattedDatesInAnArray.push(getDateInCustomFormat(currentDate));
        currentDate=new Date(currentDate.getTime()-24*60*60*1000);
    }
    // console.log(formattedDatesInAnArray);
    return formattedDatesInAnArray;
}

function getArrayOfObjectsFromObjectsOfObjects(data){
    let dictionaryObj=[];
    // console.log("Entries",Object.entries(data))
    Object.entries(data).forEach(eachEntry=>{
        let objectElementKey = eachEntry[0];
        let elements=eachEntry[1].split(",");
        let obj={
            "objectElementKey": objectElementKey,
            "english":elements[0].slice(9),
            "bengali":elements[1].slice(10),
            "use":elements[2].slice(6)
        }
        // console.log("Dictionary: ",obj);
        dictionaryObj.push(obj);
    })
    
    // dictionaryObj Output --> Array of objects including firestore object Element key
    // [{objectElementKey: 'data2', english: 'a', bengali: 'আ', use: '2'},{objectElementKey: 'data1', english: 'o', bengali: 'অ', use: '1'}]
    return dictionaryObj;
}

function getDictionaryObjectArrayFromArrayOfObjects(data){
    let dictionaryObj = getArrayOfObjectsFromObjectsOfObjects(data);
    let dictionary = [];
    dictionaryObj.forEach(line=>{
        let obj={
            "english":line["english"],
            "bengali":line["bengali"],
            "use":line["use"],
        }
        dictionary.push(obj);
    })
    // console.log("final dictionary to be used: ", dictionary)
    return dictionary;
}

function getObjectFromArray(dictionaryArray){
    let obj={};
    let dataNumber=1;
    console.log("dictionary Array: ",dictionaryArray)
    dictionaryArray.forEach(element=>{
        let data=`english: ${element["english"]}, bengali: ${element["bengali"]}, use: ${element["use"]}`
        console.log(data)
        let key="data"+dataNumber;
        obj[key]=data;
        dataNumber++;
    })
    console.log("Object: ",obj)
    return obj;
}

function findEngMatchOfLastBengChar(){
    let benData=textToArray(benText.textContent)
    let engData=textToArray(engText.value)

    let lastBenWord=benData[benData.length-1]
    let lastEngWord=engData[engData.length-1]

    let lastBenChar=lastBenWord.slice(-1)

    let benMatch=[];
    
    dictionary.forEach((element)=>{
        if(element["bengali"]==lastBenChar){
            benMatch.push(element["english"])
        }
    })
    let refinedBenMatch=[];
    benMatch.forEach((engSubStr)=>{
        if(lastEngWord.slice(-1*engSubStr.length)==engSubStr){
            refinedBenMatch.push(engSubStr)
        }
    })
    let bestMatch="";
    if(refinedBenMatch.length>1){
        bestMatch = refinedBenMatch.reduce(
            function (a, b) {
                return a.length > b.length ? a : b;
            }
        );
    }else{
        bestMatch=refinedBenMatch[0];
    }
    console.log("Best Match is : ", bestMatch)
    return bestMatch;
}

export {findCurrentWord, findBengMatch, createFullDictionary, searchAllBengWords, getLastTenDaysInAnArrayInCustomFormat, getDictionaryObjectArrayFromArrayOfObjects,getArrayOfObjectsFromObjectsOfObjects, getObjectFromArray, getDateInDiaryFormat,findEngMatchOfLastBengChar};