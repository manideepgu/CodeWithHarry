import {vari} from "./variables.js";

let btnAdd=document.getElementById("add")


btnAdd.addEventListener("click",()=>{
    
    console.log(add());
})

function add(){
    vari++
    return vari;
}