let box=document.getElementsByClassName("box");

let randomNum = (e)=>{
    e=Math.floor(Math.random()*256)
    return e;
}

for (let i = 0; i < box.length; i++) {
    let r=randomNum();
    let g=randomNum();
    let b=randomNum();
    box[i].style["backgroundColor"]=`rgb(${r},${g},${b}`;
}
