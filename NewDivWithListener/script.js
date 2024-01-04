const input=document.getElementById("input");
const submit=document.getElementById("submit");
const container=document.querySelector(".container");

submit.addEventListener("click",()=>{
    let newBox=document.createElement("div");
    newBox.className="box";
    newBox.innerHTML=input.value;
    input.value="";
    newBox.addEventListener("click",()=>{
        console.log("clicked a dynamically created element");
    })
    container.appendChild(newBox);
})