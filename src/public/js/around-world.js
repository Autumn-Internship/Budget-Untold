import { authToken, getUserId, upsertPlaylistCollection } from './user-data.js';
import { countryNamesMap, categoryIdList, marketCodes, countryCodes } from './data.js';

const confirmationElement = document.getElementById('confirmation-message');
const confirmationButton = document.getElementById('confirmation-button');
const confirmationOverlay = document.getElementById('confirmation-overlay');
const succesfulConfirmation = document.getElementById('succesful-confirmation');

export async function getCountryPlaylists() {
    let data = new FormData(worldForm);
    let countryName = data.get('country');
    let categoryName = data.get('category');
    let countryCode = countryNamesMap.get(countryName);
    let categoryId = categoryIdList[categoryName];
    let response = await fetch(`https://api.spotify.com/v1/browse/categories/${categoryId}/playlists?country=${countryCode}&limit=2`,
    {'method':'GET', 
    'headers': {
        'Authorization':`Bearer ${authToken()}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'}
    });
    return response.json();
}

export async function followPlaylist(playlistId) {
    fetch(`https://api.spotify.com/v1/playlists/${playlistId}/followers`,
    {'method':'PUT', 
    'headers': {
        'Authorization':`Bearer ${authToken()}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'}
    });
    return playlistId;
}

export async function followCountryPlaylist() {
    let countryPlaylists = await getCountryPlaylists();
    let totalPlaylists = await countryPlaylists.playlists.items.length;
    let randomNum = Math.floor(Math.random() * (totalPlaylists));
    let countryPlaylistId = await countryPlaylists.playlists.items[randomNum].id;
        await followPlaylist(countryPlaylistId);
        return countryPlaylistId;
}

export function addOptions(list, valueName) {
    let option = document.createElement('option');
    option.value = valueName;
    list.appendChild(option);
}

let worldForm = document.getElementById('world-form');
const countriesList = document.getElementById('countriesList');
const categoriesList = document.getElementById('categoriesList');

for (let code of marketCodes.markets) {
    addOptions(countriesList, countryCodes[code]);
}
for (let category in categoryIdList) {
    addOptions(categoriesList, category);
}


worldForm.addEventListener('submit', async function (event) {
    event.preventDefault();
    confirmationOverlay.style.display = 'flex';
    try {
        const playlistId = await followCountryPlaylist();

        confirmationElement.innerHTML = 'Your festival has been created!';
        confirmationButton.innerHTML = 'Great!';
        succesfulConfirmation.style.display = 'block';

        const userId = await getUserId();
        await upsertPlaylistCollection(userId, playlistId, 'around-world');
    } catch {
        succesfulConfirmation.style.display = 'none';
        confirmationElement.innerHTML =
        'Something went wrong. Please try again later.';
        confirmationButton.innerHTML = 'Ok';
    } finally {
        confirmationButton.addEventListener('click', (event) => {
            confirmationOverlay.style.display = 'none';
        });
    }
});