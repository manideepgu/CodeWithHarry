let number = prompt("Please provise a number")

// Using For Loop

let factorial = (x) => {
    let i=1;
    for (let index = 1; index <= x; index++) {
        i=i*index;
     }
     return i;
}
console.log(`Factorial of the number is: ${factorial(number)}`);

// Using Reduce property

let arr = [];

for (let index = 1; index <= number; index++){
    arr.push(index);
}
console.log(`Factorial of the number is: ${arr.reduce((a,b)=>a*b,1)}`)

