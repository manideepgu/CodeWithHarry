const imageLink = document.getElementById("imageLink")
const timeStamp = document.getElementById("timeStamp");
const titleName = document.getElementById("titleName");
const channelName = document.getElementById("channelName");
const views = document.getElementById("views");
const age = document.getElementById("age");
const submit = document.getElementById("btnSubmit");

const card = document.getElementsByClassName("card");
const image = document.getElementsByClassName("image");
const time = document.getElementsByClassName("time");
const title = document.getElementsByClassName("title");
const container = document.getElementsByClassName("container");
const cardHolder = document.getElementsByClassName("cardHolder");

console.log(container)

let data = [];

function createNewCard(newData) {
    let newCard = document.createElement("div");
    newCard.className = "card";
    let newImage = document.createElement("div")
    newImage.className = "image"
    let newImg = document.createElement("img")
    newImg.src = newData[0];
    let newTime = document.createElement("div");
    newTime.className = "time";
    newTime.innerHTML = newData[1];
    let newTitle = document.createElement("div")
    newTitle.className = "title"
    newTitle.innerHTML = newData[2];
    let newChannel = document.createElement("div");
    newChannel.className = "channel";
    newChannel.innerHTML = newData[3];
    let separator = document.createElement("div");
    separator.className = "channel";
    separator.innerHTML = " | ";
    let newViews = document.createElement("div")
    newViews.className = "view"
    newViews.innerHTML = newData[4];
    let separator1 = document.createElement("div");
    separator1.className = "channel";
    separator1.innerHTML = " | ";
    let newAge = document.createElement("div")
    newAge.className = "age"
    newAge.innerHTML = newData[5];
    let newDetailBox = document.createElement("div")
    newDetailBox.className = "detailBox"
    let newMainBox = document.createElement("div")
    newMainBox.className = "mainBox"

    newDetailBox.appendChild(newChannel)
    newDetailBox.appendChild(separator)
    newDetailBox.appendChild(newViews)
    newDetailBox.appendChild(separator1)
    newDetailBox.appendChild(newAge)

    newMainBox.appendChild(newTitle)
    newMainBox.appendChild(newDetailBox)

    newImage.appendChild(newImg)
    newImage.appendChild(newTime)

    newCard.appendChild(newImage)
    newCard.appendChild(newMainBox)

    cardHolder[0].appendChild(newCard)
    clearInputs();
}


submit.addEventListener("click", () => {
    data = [];
    data.push(imageLink.value);
    data.push(timeStamp.value);
    data.push(titleName.value);
    data.push(channelName.value);
    data.push(views.value);
    data.push(age.value);
    console.log(data.length)
    if (validateData(data).length>0) {
        createNewCard(data)
    }
})

function validateData(newData) {
    let check = true;
    if (!parseInt(newData[4]) > 0) {
        alert("Please enter a number for the number of views")
        views.value = ""
        data = false;
    } else if(newData[4] / 1000000 > 1){
        newData[4] = `${Math.floor(newData[4] / 1000000)}M`
    } else if(newData[4] / 1000 > 1){
        newData[4] = `${Math.floor(newData[4] / 1000)}K Views`
    }else{
        newData[4] = `${newData[4]} Views`
    }

    if (!parseInt(newData[5]) > 0) {
        alert("Please enter a number for the age of the video")
        age.value = ""
        check = false;
    } else if(newData[5] / 365 > 1){
        newData[5] = `${Math.floor(newData[5] / 365)} Years`
    } else if(newData[5] / 30 > 1){
        newData[5] = `${Math.floor(newData[5] / 30)} Months`
    } else {
        newData[5] = `${newData[5]} Days`
    }
    console.log("Data Validated")
    if(!check){
        newData=[]
    }
    return newData;
}

function clearInputs(){
    imageLink.value="";
    timeStamp.value="";
    titleName.value="";
    channelName.value="";
    views.value="";
    age.value="";
}