const postContent = document.querySelector("#content");
const like = document.querySelector(".like-button");

import { getDiaryEntryFromFirestore } from "./firebaseMyDiary.js";

// like.addEventListener("click",showPosts());
// setTimeout(()=>{showPosts();}, 500);

async function showPosts(){
    postContent.innerHTML="";
    let postData=await getDiaryEntryFromFirestore();
    console.log(postData.length);
    postData.forEach(element=>{
        let post=document.createElement("div");
        let postHeader=document.createElement("div");
        let eventDate=document.createElement("div");
        let dataID=document.createElement("div");
        let entryDate=document.createElement("div");
        let postText=document.createElement("div");
        
        post.className="post";
        postHeader.className="post-header";
        eventDate.className="eventDate common";
        dataID.className="dataID common";
        entryDate.className="entryDate common";
        postText.className="post-text";
        
        entryDate.innerHTML=element.dataEntryDate;
        eventDate.innerHTML=element.dataEventDate;
        dataID.innerHTML=element.dataID;
        postText.innerHTML=element.dataText

        postHeader.appendChild(eventDate);
        postHeader.appendChild(dataID);
        postHeader.appendChild(entryDate);
        post.appendChild(postHeader);
        post.appendChild(postText);
        postContent.appendChild(post);
   })
}

export{showPosts}
