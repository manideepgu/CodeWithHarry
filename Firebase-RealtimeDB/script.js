
// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// import { getDatabase, ref, push, onValue } from "https://cdnjs.cloudflare.com/ajax/libs/firebase/10.7.1/firebase-database.min.js";

import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js"

const appSettings ={
    databaseURL: "https://firstweb-e6300-default-rtdb.europe-west1.firebasedatabase.app"
}

const app = initializeApp(appSettings)

const database = getDatabase(app);

const moviesInDB = ref(database,"movies")

// console.log(app)

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBABbYq0AfyO8OlWEEN5FXWo2P2-fAfJA0",
    authDomain: "firstweb-e6300.firebaseapp.com",
    projectId: "firstweb-e6300",
    storageBucket: "firstweb-e6300.appspot.com",
    messagingSenderId: "96260072911",
    appId: "1:96260072911:web:d4bdc2e99b8a9581f95eba"
};

// Initialize Firebase
// const app = initializeApp(firebaseConfig);




let text = document.getElementById("text")
let btn=document.getElementById("btn")
let data=document.getElementById("data")
let list=document.getElementById("shoppingList")
// console.log(btn)
btn.addEventListener("click",()=>{
    // console.log("button is pressed")
    // console.log(text.value)
    push(moviesInDB,text.value)
    // newList(text.value);
    text.value="";
})

let newList = (item) =>{
    let elem=document.createElement("li")
    elem.id=item[0]
    elem.innerHTML=item[1];
    elem.addEventListener("dblclick",()=>{
        console.log(elem.id)
        let removeRef = ref(database,`movies/${elem.id}`)
        remove(removeRef);
    })
    // console.log(item)
    list.appendChild(elem)
}

function clearList(){
    list.innerHTML=""
}

onValue(moviesInDB,function(snapshot){ 
    if(snapshot.exists()){
        let array = Object.entries(snapshot.val());
        console.log(array);
        clearList();
        array.forEach(element => {
            // console.log(element);
        newList(element);
    });
    }else{
        console.log("No item exists");
    }
    
})
 
// let p;
// async function aaaa(){
    
//     await onValue(moviesInDB,function(snapshot){ 
//         console.log(snapshot)
//         return snapshot;
// })

// }
// p=aaaa();
// console.log(p)

    
// ref.on('value', (snapshot) => {
//     console.log(snapshot.val());
//   }, (errorObject) => {
//     console.log('The read failed: ' + errorObject.name);
//   }); 

