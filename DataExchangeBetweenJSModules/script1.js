const input1=document.getElementById("input1")
const button1=document.getElementById("button1")
const output=document.querySelector(".output")

import {setData,getData} from "./data.js"


button1.addEventListener("click",()=>{
    console.log("Script1 button is pressed and input is: ",input1.value)
    console.log("data is: ",getData())
    output.innerHTML=getData();    
    setData(input1.value);
})