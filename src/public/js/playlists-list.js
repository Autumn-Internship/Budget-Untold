import {
  hasPremiumAccount,
  getUserDisplayName,
  getUserId,
} from "./user-data.js";

import{getPlaylistDetails} from "./spotify-requests.js";

const userId = await getUserId();

hasPremiumAccount();

const seeHistoy = document.getElementById("playlist-list-button");

export async function postPlaylistCollection(userId, playlistId, playlistType) {
  try {
    await fetch("http://127.0.0.1:8080/playlists", {
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
          },
        ],
      }),
    });
  } catch {
    console.log("Didn't work :(");
  }
}

export async function upsertPlaylistCollection( userId, playlistId, playlistType) {
  try {
    await fetch(
      `http://127.0.0.1:8080/playlists/upsert/${userId}?playlistId=${playlistId}&playlistType=${playlistType}`,
      {
        method: "PUT",
        headers: {
          Accept: "*/*",
          "Content-Type": "application/json",
        },
      }
    );
  } catch(err) {
    console.log(err);
  }
}

export async function getUserPlaylists(userId) {
  try {
    const response = await fetch(`http://127.0.0.1:8080/playlists/${userId}`, {
      method: "GET",
      headers: {
        Accept: "*/*",
        "Content-Type": "application/json",
      },
    });
    const showId = await response.json();

    let userPlaylistsIds = showId.value.map((result) => result.id);
    let userPlayliststype= showId.value.map((result) => result.playlistType);

    return userPlaylistsIds;
  } catch(err) {
    console.log(err);
  }
}

export async function removePlaylist(userId, playlistId) {
  try {
    await fetch(
      `http://127.0.0.1:8080/playlists/removePlaylist/${userId}?playlistId=${playlistId}`,
      {
        method: "PATCH",
        headers: {
          Accept: "*/*",
          "Content-Type": "application/json",
        },
      }
    );
  } catch(err) {
    console.log(err);
  }
}

async function showPlaylists(userPlaylists){
    const playlistDetails= await getPlaylistDetails(userPlaylists);
    const playlistList = document.getElementById("playlist-list");

    const playlistCard = document.createElement("div");
    playlistCard.classList.add("artist-card");

    const playlistName = document.createElement("p");
    const contentPlaylistName = document.createTextNode(playlistDetails.playlistName);

    //const playlistImage = playlistDetails.playlistImage;
    //playlistCard.style.backgroundImage = "url(" + playlistImage + ")";

    playlistName.appendChild(contentPlaylistName);
    playlistCard.appendChild(playlistName);
    playlistList.appendChild(playlistCard);
}

seeHistoy.onclick = async () => {
  try {
    const userPlaylists = await getUserPlaylists(userId);
    console.log(userPlaylists);
    
    for (let i = 0; i < userPlaylists.length; i++) {
    await showPlaylists(userPlaylists[i]);}
  } catch {
    console.log("Sometimes went wrong");
  }
};

