import { authToken } from './user-data.js';
import { countryNamesMap, categoryIdList } from './data.js';
import { worldForm } from './index.js';

export async function getCountryPlaylists() {
    let data = new FormData(worldForm);
    let countryName = data.get('country');
    let categoryName = data.get('category');
    let countryCode = countryNamesMap.get(countryName);
    let categoryId = categoryIdList[categoryName];
    let response = await fetch(`https://api.spotify.com/v1/browse/categories/${categoryId}/playlists?country=${countryCode}&limit=50`,
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
}

export async function followCountryPlaylist() {
    let countryPlaylists = await getCountryPlaylists();
    let totalPlaylists = await countryPlaylists.playlists.items.length;
    let randomNum = Math.floor(Math.random() * (totalPlaylists + 1));
    let countryPlaylistId = await countryPlaylists.playlists.items[randomNum].id;
        await followPlaylist(countryPlaylistId);
}

export function addOptions(list, valueName) {
    let option = document.createElement('option');
    option.value = valueName;
    list.appendChild(option);
}

