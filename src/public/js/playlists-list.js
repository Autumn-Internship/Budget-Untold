import { hasPremiumAccount, getUserDisplayName } from "./user-data.js";

const userNameElement = document.getElementById("user-name");
const userName = await getUserDisplayName();
userNameElement.innerHTML = userName;

hasPremiumAccount();

async function postPlaylistCollection(userId, playlistId, playlistType) {
    try {
        await fetch('http://127.0.0.1:8080/playlists',
            {
                method: "POST",
                headers: {
                    Accept: "*/*",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                userId: userId,
                playlists: [
                        {
                            id: playlistId,
                            playlistType: playlistType,
                        }
                    ],
                }),
            }
        )
        console.log('Yaay!');
    } catch {
        console.log('Didn\'t work :(');
    }
}

async function patchPlaylistCollection(userId, playlistId, playlistType) {
    try {
        await fetch(`http://127.0.0.1:8080/playlists/updateCollection/${userId}?playlistId=${playlistId}&playlistType=${playlistType}`,
            {
                method: "PATCH",
                headers: {
                    Accept: "*/*",
                    "Content-Type": "application/json",
                },
            }
        )
        console.log('Yaay!');
    } catch {
        console.log('Didn\'t work :(');
    }
}

//patchPlaylistCollection('aeg', 'jf564', 'around-world');