let info=[];
info.push("Initializing Hacking");
info.push("Reading Your Files");
info.push("Password Files Detected");
info.push("Sending all passwords and personal files to server");
info.push("Cleaning up");

const infoBoard=document.querySelector(".infoBoard")

async function executeInfo(){
    console.log("inside Execute Info")
    for(let i=0;i<info.length;i++){
        console.log("inside Execute Info for loop")
        let delayDuration=Math.floor(Math.random()*7000);
        let dots=delayDuration/250;
        for(let k=0; k<dots;k++){
            printC(i,k%4);
            await delay(250);
        }   
    }
}

async function printC(i,dots){
    iterator=0;
    console.log("inside printC while loop")
    let toBePrinted=info[i];
    for(let iter=0;iter<dots;iter++){
        toBePrinted=toBePrinted+"."
    }
    infoBoard.textContent=toBePrinted;    
}
        
    
 async function delay(delayDuration){
    await new Promise(resolve =>{
        setTimeout(resolve, delayDuration)
    })
 }   

executeInfo()
