
// // Import the functions you need from the SDKs you need
// import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
// import { getFirestore, collection, getDocs, addDoc, updateDoc, query, where } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js'
// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries

// // Your web app's Firebase configuration
// const firebaseConfig = {
//     apiKey: "AIzaSyChM6hDa05UQ2pGF_RA-o5pVnWcFsGr4DQ",
//     authDomain: "first-dc554.firebaseapp.com",
//     projectId: "first-dc554",
//     storageBucket: "first-dc554.appspot.com",
//     messagingSenderId: "999505511062",
//     appId: "1:999505511062:web:0e6af0b9c9dae1fd18b8b7"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const db = getFirestore(app);

// async function getDiaryEntryFromFirestore() {
//     let fetchedData = [];
//     const querySnapshot = await getDocs(collection(db, "Dictionary"));
//     querySnapshot.forEach((doc) => {
//         // console.log(`${doc.id} => ${JSON.stringify(doc.data())}`);
//         let obj = {
//             "english": doc.data().english,
//             "bengali": doc.data().bengali,
//             "use": doc.data().use
//         }
//         fetchedData.push(obj);
//     });
//     // console.log(fetchedData);
//     return (fetchedData);
// }

// function addDataToFirestore(english, bengali) {
//     console.log("Adding words: ",english,"and bengali: ",bengali)
//     addDoc(collection(db, "Dictionary"), {
//         english: english,
//         bengali: bengali,
//         use: "1"
//     })
//         .then((docRef) => {
//             console.log("Document written with ID: ", docRef.id);
//         })
//         .catch((error) => {
//             console.error("Error adding document: ", error);
//         });
// }

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

// export { getDiaryEntryFromFirestore, addDataToFirestore, updateDataToFirestore }
