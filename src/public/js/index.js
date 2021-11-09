import { getUserDisplayName } from "./user-data.js";

const currentUser = await getUserDisplayName();
const createOwnCardElement = document.getElementById("create-own");
const musicFestivalCardElement = document.getElementById("music-festival");
const aroundWorldCardElement = document.getElementById("around-world");

if(!currentUser) {
    createOwnCardElement.href = "./authorization.html";
    musicFestivalCardElement.href = "./authorization.html";
    aroundWorldCardElement.href = "./authorization.html";
}
