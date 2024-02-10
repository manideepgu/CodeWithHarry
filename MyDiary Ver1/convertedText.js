const benText=document.querySelector("#convertedText")
const engText=document.querySelector("#textArea")
const postButton=document.querySelector("#post-button")

import { isAlphabet, textToArray} from "./keyboard.js";
import { updateToFirestoreDictionary,addEntryToFirestoreDiary } from "./firebaseMyDiary.js";
import { showPosts } from "./posts.js";


postButton.addEventListener("click",()=>{
    let benData=textToArray(benText.textContent)
    let engData=textToArray(engText.value)
    // console.log("Bengali Text ", benData)
    // console.log("English Text ", engData)
    let dataForDictionaryUpdate=getArrayDataForFirestoreDictionaryUpdate(benData,engData)
    addEntryToFirestoreDiary(benText.textContent);
    // console.log(dataForDictionaryUpdate)
    updateToFirestoreDictionary(dataForDictionaryUpdate);
    engText.value="";
    benText.textContent="";
    showPosts();
})

function getArrayDataForFirestoreDictionaryUpdate(benData,engData){
    let dataForDictionaryUpdate=[];
    if(benData.length==engData.length){
        for(let i=0;i<engData.length;i++){
            if((isAlphabet(engData[i].charAt(0))=="alphabet")&&(isAlphabet(engData[i].charAt(0))=="alphabet")){
                let obj={
                    "english": engData[i],
                    "bengali": benData[i]
                }
                dataForDictionaryUpdate.push(obj);
            }
        }
    }
    console.log("Data For Dictionary", dataForDictionaryUpdate)
    return dataForDictionaryUpdate;
}

function showConvertedData(benDataArray){
    console.log("Inside showConvertedData function()  ",JSON.stringify(benDataArray))
    benText.innerHTML="";
    benDataArray.forEach((element)=>{
        let newConvertedWord=document.createElement("div");
        newConvertedWord.className="convertedWord";
        newConvertedWord.setAttribute("contenteditable",true);
        newConvertedWord.innerHTML=element.join("");
        benText.appendChild(newConvertedWord);
    })
}



export {showConvertedData}