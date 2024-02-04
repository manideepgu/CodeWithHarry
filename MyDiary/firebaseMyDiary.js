
// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, collection, getDoc, getDocs, setDoc, addDoc, updateDoc, query, where } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js'
import { getLastTenDaysInAnArrayInCustomFormat, getDictionaryObjectArrayFromArrayOfObjects, getObjectFromArray, getDateInDiaryFormat } from "./help.js";
import { banjan } from "./data.mjs";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDSxr1sPAyWguw4IPC12rRwsxDQz4DN8JM",
    authDomain: "mydiary-6ac1a.firebaseapp.com",
    projectId: "mydiary-6ac1a",
    storageBucket: "mydiary-6ac1a.appspot.com",
    messagingSenderId: "441549564921",
    appId: "1:441549564921:web:1b9e2a1ef483add43deb28",
    measurementId: "G-CNP5DNZEC3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

let dictionary=await createFullDictionary();

async function createFullDictionary() {
    let dictionary = [];
    let fetchedData = await getDictionaryFromFirestore();
    console.log("Dictionary: ", fetchedData);
    // let fetchedData=[];
    dictionary = banjan.concat(fetchedData);
    console.log("Dictionary: ", dictionary);
    return dictionary;
}

function logIn(email, pass) {
    signInWithEmailAndPassword(auth, email, pass).then((credential) => {
        // window.open("index.html", '_blank', 'height=500,width=500');
        window.location.href = "index.html"
        console.log(credential.user.uid);
        return (credential);
    }).catch((error) => {
        console.log(error.code)
        console.log(error.message)
    })
}


async function getDiaryEntryFromFirestore() {
    let fetchedData = [];
    let dates = getLastTenDaysInAnArrayInCustomFormat();
    
    // const firebaseConfig = {
    //     apiKey: "AIzaSyDSxr1sPAyWguw4IPC12rRwsxDQz4DN8JM",
    //     authDomain: "mydiary-6ac1a.firebaseapp.com",
    //     projectId: "mydiary-6ac1a",
    //     storageBucket: "mydiary-6ac1a.appspot.com",
    //     messagingSenderId: "441549564921",
    //     appId: "1:441549564921:web:1b9e2a1ef483add43deb28",
    //     measurementId: "G-CNP5DNZEC3"
    // };
    
    // // Initialize Firebase
    // const app = initializeApp(firebaseConfig);
    // const db = getFirestore(app);

    // console.log (db)

    for (let i = 0; i < dates.length; i++) {
        let date = dates[i];
        const querySnapshot = await getDocs(query(collection(db, "Entries_of_Z1ZV9yScxmVj8yPmCTZw"), where("dataEntryDate", ">=", date), where("dataEntryDate", "<=", date + "\uf8ff")));
        // const entriesRef = collection(db, "Entries_of_RiKxHmb3lBL0JiPrg2AQ");
        // const queryRef = query(entriesRef, where("dataID", ">", 1000));
        // const querySnapshot = await getDocs(queryRef);
        // console.log(querySnapshot.length);    
        querySnapshot.forEach((doc) => {
            // console.log(`${doc.id} => ${JSON.stringify(doc.data())}`);
            let obj = {
                "dataEntryDate": doc.data().dataEntryDate,
                "dataEventDate": doc.data().dataEventDate,
                "dataID": doc.data().dataID,
                "dataText": doc.data().dataText
            }
            fetchedData.push(obj);
        });
    }
    console.log(fetchedData);
    return (fetchedData);
}



async function addEntryToFirestoreDiary(benText) {
    const collectionRef = collection(db, "Entries_of_Z1ZV9yScxmVj8yPmCTZw");
    let dataObj = await buildObjectForFirestoreDiary(benText);
    let docRef=await addDoc(collectionRef,dataObj);
    console.log("Uploaded reference of document is: ",docRef);

}

async function getDictionaryFromFirestore() {
    // console.log("db====>>>>>>>",db);    
    let firestoreDictionary = [];
    const entriesRef = collection(db, "Dictionary");
    const querySnapshot = await getDocs(entriesRef);

    querySnapshot.forEach((doc) => {
        // console.log(`${doc.id} => ${JSON.stringify(doc.data())}`);

        // console.log(`${Object.values(doc.data())[0]}`);
        // console.log(`${Object.values(doc.data())[1]}`);

        // console.log(`${JSON.stringify(Object.entries(doc.data()).length)}`);
        firestoreDictionary = getDictionaryObjectArrayFromArrayOfObjects(doc.data())
    });
    // console.log(firestoreDictionary);
    return firestoreDictionary;
}

async function updateToFirestoreDictionary(data) {
    let firestoreDictionary = await getDictionaryFromFirestore();
    console.log("Firestore Dictionary: ", firestoreDictionary)
    data.forEach(eachEntry => {
        let entryPresentInDictionary = false;
        firestoreDictionary.forEach(eachDictItem => {
            if ((eachDictItem["english"] == eachEntry["english"]) && (eachDictItem["bengali"] == eachEntry["bengali"])) {
                eachDictItem["use"] = parseInt(eachDictItem["use"]) + 1;
                entryPresentInDictionary = true;
            }
        })
        if (entryPresentInDictionary == false) {
            let obj = {
                "english": eachEntry["english"],
                "bengali": eachEntry["bengali"],
                "use": "1"
            }
            firestoreDictionary.push(obj);
        }
    })
    let firestoreDictionaryObject = getObjectFromArray(firestoreDictionary);
    const entriesRef = collection(db, "Dictionary");
    const querySnapshot = await getDocs(entriesRef);
    querySnapshot.forEach((doc) => {
        console.log(doc.ref)
        setDoc(doc.ref, firestoreDictionaryObject)
    });
}

// async function updateDataToFirestore(english, bengali) {
//     console.log("Searching for specific document in firestore Collection", english)
//     let queryDocWhereEngBenExists = query(collection(db, "Dictionary"), where("english", "==", english), where("bengali", "==", bengali));
//     console.log("Query Initiated", english)
//     const querySnapshot = await getDocs(queryDocWhereEngBenExists);
//     querySnapshot.forEach((doc) => {
//         let useData = parseInt(doc.data().use)
//         console.log(doc.id, " => ", doc.data());
//         useData++
//         console.log("Use Data:     ", useData);
//         updateDoc(doc.ref,{
//             "use" : useData
//         });
//     });
//     console.log("Firestore Document Updated", english)
// }

async function buildObjectForFirestoreDiary(bengText) {
    let date = new Date();
    let formattedDate = getDateInDiaryFormat(date);
    let dataID = await getLastDataIDFromDiary()
    console.log(formattedDate)
    let obj = {
        "dataCaptionImage1": null,
        "dataCaptionImage2": null,
        "dataEntryDate": formattedDate,
        "dataEntryNumber": 1,
        "dataEventDate": formattedDate,
        "dataFont": null,
        "dataFontColour": null,
        "dataID": dataID+1,
        "dataImageLocation1": "",
        "dataImageLocation2": null,
        "dataText": bengText,
        "dataTextSize": 0,
        "driveImage1": null,
        "driveImage2": null,
        "dv1Identifier": null,
        "dv1Thumbnail1": null,
        "dv1Thumbnail2": null,
        "dv2Identifier": null,
        "dv2ImageLocation1": null,
        "dv2ImageLocation2": null,
        "dv2Thumbnail1": null,
        "dv2Thumbnail2": null,
        "dv3Identifier": null,
        "dv3ImageLocation1": null,
        "dv3ImageLocation2": null,
        "dv3Thumbnail1": null,
        "dv3Thumbnail2": null,
        "dv4Identifier": null,
        "dv4ImageLocation1": null,
        "dv4ImageLocation2": null,
        "dv4Thumbnail1": null,
        "dv4Thumbnail2": null,
        "dv5Identifier": null,
        "dv5ImageLocation1": null,
        "dv5ImageLocation2": null,
        "dv5Thumbnail1": null,
        "dv5Thumbnail2": null,
        "name": "Manideep Gupta",
        "userID": "Z1ZV9yScxmVj8yPmCTZw"
    }
    return obj;
}

async function getLastDataIDFromDiary(){
    let data = await getDiaryEntryFromFirestore();
    console.log(data.length)
    let newDataID=0;
    if(data.length>0){
        for(let i=0;i<data.length;i++){
            if(data[i].dataID>newDataID){
                newDataID=data[i].dataID
            }
        }
    }else{
        newDataID=99999
    }
    console.log(newDataID)
    return newDataID;

}

export { createFullDictionary, getDiaryEntryFromFirestore, logIn, updateToFirestoreDictionary, getDictionaryFromFirestore, addEntryToFirestoreDiary, dictionary };
