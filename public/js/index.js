import { followCountryPlaylist } from './around-world.js';
import { getUserDisplayName } from './user-data.js';

const userNameElement = document.getElementById('user-name');

const musicFestivalButton = document.getElementById('music-festival-button');

const worldFestivalButton = document.getElementById('world-festival-button');
const confirmationElement = document.getElementById('confirmation-message');

if (userNameElement) {
    const userName = await getUserDisplayName();
    userNameElement.innerHTML = userName;
}

if(worldFestivalButton) {
    worldFestivalButton.onclick = async () => {
        try {
            await followCountryPlaylist();
            confirmationElement.innerHTML = 'Your festival has been created!';
        } catch {
            confirmationElement.innerHTML = 'Something went wrong. Please try again later.';
        }
    };
}

if (musicFestivalButton) {
    musicFestivalButton.onclick = () => {
        confirmationElement.innerHTML = 'Your festival has been created!';
     }
}
