import { getDatafromFirestore, updateDatatoFirestore } from "./firebase.js";

const inputName = document.getElementById("name")
const inputAddress = document.getElementById("address")
const inputPhoneNumber = document.getElementById("phn")


const btnToSendDataToFirestore = document.getElementById("upload");
const btnToRefreshDataFromFirestore = document.getElementById("refresh");
const viewBox=document.querySelector(".viewBox");

async function fillData(){
    let fetchedData=await getDatafromFirestore();
    viewBox.innerHTML="";
    console.log("Here It is: ", viewBox);
    console.log("Looping through fetched Data");
    console.log(fetchedData);
    fetchedData.forEach((element)=>{
        let viewRow=document.createElement("div");
        viewRow.className="row";
        let nameDiv=document.createElement("div");
        console.log(viewRow);
        nameDiv.className="view"
        nameDiv.innerHTML=element.name;
        viewRow.appendChild(nameDiv);
        let addressDiv=document.createElement("div");
        addressDiv.className="view"
        addressDiv.innerHTML=element.address;
        viewRow.appendChild(addressDiv);
        let phoneDiv=document.createElement("div");
        phoneDiv.className="view"
        phoneDiv.innerHTML=element.phonenumber;
        viewRow.appendChild(phoneDiv);
        viewBox.appendChild(viewRow);
    });
};

btnToSendDataToFirestore.addEventListener("click",()=>{
   updateDatatoFirestore(inputName.value, inputAddress.value, inputPhoneNumber.value);
})

btnToRefreshDataFromFirestore.addEventListener("click",()=>{
    fillData();
})
