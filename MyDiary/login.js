const email = document.getElementById("email");
const pass = document.getElementById("pass");
const login = document.getElementById("login");

import { logIn } from "./firebaseMyDiary.js";

login.addEventListener("click",()=>{
    console.log("LOGIN function INITIATED")
    console.log("LOGIN ===>>>",email.value)
    console.log("LOGIN ===>>>",pass.value)
    logIn(email.value,pass.value)
    
})