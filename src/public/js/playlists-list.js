import {
  hasPremiumAccount,
  getCurrentUserPlaylists,
  getUserId,
} from "./user-data.js";

import{getPlaylistDetails} from "./spotify-requests.js";

const userId = await getUserId();

hasPremiumAccount();

const seeHistoy = document.getElementById("playlist-list-button");

export async function getUserPlaylistsIds(userId) {
  try {
    const response = await fetch(`http://127.0.0.1:8080/playlists/${userId}`, {
      method: "GET",
      headers: {
        Accept: "*/*",
        "Content-Type": "application/json",
      },
    });
    const userPlaylists = await response.json();

    let userPlaylistsIds = userPlaylists.value.map((playlist) => playlist.id);

    return userPlaylistsIds;
  } catch(err) {
    console.log(err);
  }
}

export async function getUserPlaylistsTypes(playlistType) {
  try {
    const response = await fetch(`http://127.0.0.1:8080/playlists/${playlistType}`, {
      method: "GET",
      headers: {
        Accept: "*/*",
        "Content-Type": "application/json",
      },
    });
    const userPlaylists = await response.json();

    let userPlaylistsIds = userPlaylists.value.map((playlist) => playlist.id);

    return userPlaylistsIds;
  } catch(err) {
    console.log(err);
  }
}

async function removePlaylist(userId, playlistId) {
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

    const playlistImage = playlistDetails.playlistImage;
    playlistCard.style.backgroundImage = "url(" + playlistImage + ")";

    playlistName.appendChild(contentPlaylistName);
    playlistCard.appendChild(playlistName);
    playlistList.appendChild(playlistCard);
}

async function removeDeletedPlaylists(userPlaylistsIds) {
  const currentUserPlaylists = await getCurrentUserPlaylists();
  let dBPlaylistsSet = new Set();

  for (let playlistId of userPlaylistsIds) {
    dBPlaylistsSet.add(playlistId);
  }

  for (let playlist of currentUserPlaylists.items) {
    if (dBPlaylistsSet.has(playlist.id)) {
      dBPlaylistsSet.delete(playlist.id);
    }
  }

  for (let playlistId of dBPlaylistsSet) {
    removePlaylist(userId, playlistId);
  }
}

seeHistoy.onclick = async () => {
  try {
    let userPlaylistsIds = await getUserPlaylistsIds(userId);
    await removeDeletedPlaylists(userPlaylistsIds);
    userPlaylistsIds = await getUserPlaylistsIds(userId);

    for (let playlistId of userPlaylistsIds) {
      await showPlaylists(playlistId);
    }
  } catch {
    console.log("Sometimes went wrong");
  }
};

