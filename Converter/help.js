import { banjan } from "./data.mjs";
import { getDatafromFirestore } from "./firebase.js";

async function createFullDictionary(){
    let dictionary=[];
    let fetchedData=await getDatafromFirestore()
    dictionary=banjan.concat(fetchedData);
    console.log(dictionary);
    return dictionary;
}

let dictionary= await createFullDictionary();

function findCurrentWord(text){
    let wordsArray=text.split(" ");
    let currentWord=wordsArray[wordsArray.length-1];
    return currentWord;
}

function findBengMatch(text){
    let originalWord = findCurrentWord(text);
    let currentWord=originalWord;
    let bengText="";
    console.log(`Searching start with currentWord = ${currentWord}`)
    while(currentWord!=""){
        console.log(`In the while loop. currentWord = ${currentWord}`)
        let bengWord = searchBengWord(currentWord);
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

function searchBengWord(subWord){
    console.log(dictionary);
    let searchSuccess=false;
    let result = [];
    dictionary.forEach(element => {
        if(element.english==subWord){
            console.log(`Searching the data: ${element.bengali}`);
            searchSuccess=true;
            result.push(element);
        }
    });
    console.log(`Word search finnished for subWord: ${subWord}`)
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

export {findCurrentWord, findBengMatch, createFullDictionary};