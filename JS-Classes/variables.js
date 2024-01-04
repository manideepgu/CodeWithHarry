// class variable {
//     static number;  
//     static {
//         console.log("static initializer");
//         variable.number=1;
//     }
//     get (){
//         return number
//     }

//     set (x){
//         number=x;
//     }
//     add(number){
//         number++;
//         console.log(number)
//     }
//     deduct(number){
//         number--;
//         console.log(number)
//     }
// }
let vari=1;

let btnDeduct=document.getElementById("deduct")


btnDeduct.addEventListener("click",()=>{
    // add();
    vari--;
    console.log(vari);
})


export {vari}