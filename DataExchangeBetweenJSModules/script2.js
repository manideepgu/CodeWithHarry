const input2=document.getElementById("input2")
const button2=document.getElementById("button2")
const output=document.querySelector(".output")

import {setData,getData} from "./data.js"


button2.addEventListener("click",()=>{
    console.log("Script2 button is pressed and input is: ",input2.value)
    console.log("data is: ",getData())
    output.innerHTML=getData();    
    setData(input2.value);
})