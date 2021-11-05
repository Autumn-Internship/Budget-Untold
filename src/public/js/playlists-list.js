import { hasPremiumAccount, getUserDisplayName } from "./user-data.js";

const userNameElement = document.getElementById("user-name");
const userName = await getUserDisplayName();
userNameElement.innerHTML = userName;

hasPremiumAccount();