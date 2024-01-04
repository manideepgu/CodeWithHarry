const text = document.getElementById("typingArea");
const arrays = document.querySelector(".arrays");
const arrayBox = document.querySelector(".arrayBox");

let cursor;
let textArray=[];
let lastEntry="";
let previousKey="";

text.addEventListener("keydown",(e)=>{
    console.log("A key is down.");
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
            console.log("Value of Previous Key is ",previousKey)
            let newText="";
            textArray.forEach(element=>{
                newText=newText+element;
            })
            console.log("new text is --->>>>>",newText)
            text.value=newText;
            previousKey="";
        }
    } else {
        console.log('The Key has multiple characters');
        if(e.key=="Backspace"){
            console.log('Backspace key pressed');
            deleteLastElement(textArray);
        } 
        if(e.key=="Control"){
            console.log("Control is pressed");
            previousKey="Control";
            console.log("Previous Key is set to Control")
        }
    }
        createElement(textArray);    
});

function deleteLastElement(textArray){
    console.log("Deleting the Last element");
    let length = textArray.length;
    if(length>0){
        console.log("Array is not empty");
        let lastElement=textArray[length-1];
        if(lastElement.length>1){
            console.log("The last element of the array has more than one character");
            lastElement=lastElement.slice(0,-1);
            console.log("The last character in the last element of the array is removed");
            textArray[length-1]=lastElement;
        } else {
            console.log("The last element of the array has only one character");
            textArray.pop();
            console.log("The last element of the array is removed");
        }
    }
}

function createElement(textArray){
    console.log("Creating a new element inside createElement function");
    arrays.innerHTML="";
    textArray.forEach(element => {
            let elem = document.createElement("div");
            elem.className="arrayBox";
            elem.innerHTML=element;
            arrays.appendChild(elem);
        });
    }
