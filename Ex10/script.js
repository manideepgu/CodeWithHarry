console.log("Lets Start");
let adj = {
    first: "Crazy",
    second: "Amazing",
    third: "Fire"
}


let mid = {
    first: "Engine",
    second: "Foods",
    third: "Garments"
}

let word = {
    first: "Bros",
    second: "Limited",
    third: "Hub"
}

let choice = () => {
    let i = Math.floor(Math.random()*3);
    if(i==0){
        return ("first");
    }
    else if(i==1){
        return("second");
    }
    else{
        return("third");
    }
}

console.log(`${adj[choice()]} ${mid[choice()]} ${word[choice()]}`)

