let arr=[{"eng": "eng","ben": "ben"},{"eng":"fra","ben":"ger"}]

console.log("Initial Log....",arr);

let lastItem=arr[arr.length-1];

let brr=["sky","buy"];


setTimeout(function() {
    //your code to be executed after 1 second
    lastItem["eng"]=brr;
    console.log("Final Log....",arr);
  }, 5000);
