
  // Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {getFirestore, collection, getDocs, addDoc} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
apiKey: "AIzaSyChM6hDa05UQ2pGF_RA-o5pVnWcFsGr4DQ",
authDomain: "first-dc554.firebaseapp.com",
projectId: "first-dc554",
storageBucket: "first-dc554.appspot.com",
messagingSenderId: "999505511062",
appId: "1:999505511062:web:0e6af0b9c9dae1fd18b8b7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);





async function getDiaryEntryFromFirestore(){
    let fetchedData=[];
    const querySnapshot = await getDocs(collection(db, "AddressBook"));
    querySnapshot.forEach((doc) => {
        // console.log(doc);
        console.log(`${doc.id} => ${JSON.stringify(doc.data())}`);
        let obj = {
            "name": doc.data().name,
            "address": doc.data().address,
            "phonenumber": doc.data().phonenumber
        }
        fetchedData.push(obj);
    });
    console.log(fetchedData);
    return(fetchedData);
}


function updateDatatoFirestore(name,address,phonenumber){
    addDoc(collection(db,"AddressBook"),{
        name: name,
        address: address,
        phonenumber: phonenumber
    })
    .then((docRef) => {
        console.log("Document written with ID: ", docRef.id);
    })
    .catch((error) => {
        console.error("Error adding document: ", error);
    });
}

export {getDiaryEntryFromFirestore, updateDatatoFirestore}
