import { followCountryPlaylist, addOptions } from './around-world.js';
import { getUserDisplayName } from './user-data.js';
import { categoryIdList, marketCodes, countryCodes } from './data.js';

const userNameElement = document.getElementById('user-name');

const musicFestivalButton = document.getElementById('music-festival-button');

const worldFestivalButton = document.getElementById('world-festival-button');
const confirmationElement = document.getElementById('confirmation-message');

export let worldForm = document.getElementById('world-form');
const countriesList = document.getElementById('countriesList');
const categoriesList = document.getElementById('categoriesList');

if (userNameElement) {
    const userName = await getUserDisplayName();
    userNameElement.innerHTML = userName;
}



if (musicFestivalButton) {
    musicFestivalButton.onclick = () => {
        confirmationElement.innerHTML = 'Your festival has been created!';
     }
}

if (countriesList) {
    for (let code of marketCodes.markets) {
        addOptions(countriesList, countryCodes[code]);
    }
    for (let category in categoryIdList) {
        addOptions(categoriesList, category);
    }
}

if(worldForm) {
    worldForm.addEventListener('submit', async function(event) {
        event.preventDefault();
        try {
            await followCountryPlaylist();
            confirmationElement.innerHTML = 'Your festival has been created!';
        } catch {
            confirmationElement.innerHTML = 'Something went wrong. Please try again later.';
        }
    });
}