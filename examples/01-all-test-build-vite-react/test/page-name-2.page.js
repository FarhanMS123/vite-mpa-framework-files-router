// direct script src

console.log("hello");
document.getElementById("root").innerHTML = "<b>Hello</b>"

const headingElement = document.createElement('h1');
headingElement.textContent = 'Hello';

document.body.appendChild(headingElement);