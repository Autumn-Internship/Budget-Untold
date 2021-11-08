import { getUserDisplayName } from "./user-data.js";


let userName = await getUserDisplayName();
let greetingElement = document.getElementById("greeting");


if (!userName){
    greetingElement.innerHTML = 'Hello!';

} else  {
    greetingElement.innerHTML = `Hello, ${userName}!`;
}


