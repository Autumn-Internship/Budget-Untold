import { getUserDisplayName } from "./user-data.js";


let userName = await getUserDisplayName();
let greetingElement = document.getElementById("greeting");
const logInOutButton=document.getElementById("logout-button");


if (!userName){
    greetingElement.innerHTML = 'Hello!';
    logInOutButton.innerHTML = "Log in";
    logInOutButton.className="medium-p";

} else  {
    greetingElement.innerHTML = `Hello, ${userName}!`;
}


