import { authToken } from './user-data.js';

export async function getCountryPlaylist() {
    let response = await fetch('https://api.spotify.com/v1/browse/categories/party/playlists?country=DE&limit=1',
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
    let countryPlaylist = await getCountryPlaylist();
    let countryPlaylistId = await countryPlaylist.playlists.items[0].id;
    followPlaylist(countryPlaylistId);
}

