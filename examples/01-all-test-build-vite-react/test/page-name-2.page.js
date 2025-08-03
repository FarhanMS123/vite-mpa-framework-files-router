// direct script src

const x = require("./page-name-2.companion");
console.log(x);

console.log("hello");
document.getElementById("root").innerHTML = "<b>Hello</b>"

const headingElement = document.createElement('h1');
headingElement.textContent = 'Hello';

document.body.appendChild(headingElement);