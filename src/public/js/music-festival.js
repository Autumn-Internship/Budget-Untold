import { authToken, getUserId, getUserDisplayName } from "./user-data.js";
import { timeTable } from "./data.js";
import { getTopArtists } from "./spotify-data.js";

const userNameElement = document.getElementById("user-name");
const confirmationElement = document.getElementById("confirmation-message");
const musicFestivalButton = document.getElementById("music-festival-button");

const userName = await getUserDisplayName();
userNameElement.innerHTML = userName;

async function getTopTracks(artistIdArray) {
  let arrayTop = [];

  artistIdArray.map(async (artistId) => {
    const topTracks = await fetch(
      `https://api.spotify.com/v1/artists/${artistId}/top-tracks?market=RO`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${authToken()}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    );

    let trackArray = [];
    let uriArray = [];
    const topTracksResponse = await topTracks.json();

    topTracksResponse.tracks.map((track) => {
      trackArray.push(track.name);
      uriArray.push(track.uri);
    });

    trackArray = trackArray.slice(0, 5).reverse();
    uriArray = uriArray.slice(0, 5).reverse();

    const finalTracksAndArtists = {
      artist: topTracksResponse.tracks[0].album.artists[0].name,
      tracks: trackArray,
      uri: uriArray,
    };

    arrayTop.push(finalTracksAndArtists);
  });
  return arrayTop;
}

async function createPlaylist() {
  let userId = await getUserId();
  const emptyPlaylist = await fetch(
    `https://api.spotify.com/v1/users/${userId}/playlists`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${authToken()}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: "Music Festival",
        description: "The coolest playlist",
        public: false,
      }),
    }
  );
  const emptyPlaylistResponse = await emptyPlaylist.json();
  const emptyPlaylistId = emptyPlaylistResponse.id;
  return emptyPlaylistId;
}

async function generateMusicFestivalPlaylist(topTracks) {
  const topTracksForPlaylist = await topTracks;
  const playlistId = await createPlaylist();

  const uriFinalArray = [];
  topTracksForPlaylist.map((finalTracksAndArtists) => {
    finalTracksAndArtists.uri.map((uri) => {
      uriFinalArray.push(uri);
    });
  });

  let resultUri = "";
  uriFinalArray.map((element) => (resultUri += element + ","));
  resultUri = resultUri.slice(0, resultUri.length - 1);
  let encodedUri = encodeURIComponent(resultUri);

  const musicPlaylist = await fetch(
    `https://api.spotify.com/v1/playlists/${playlistId}/tracks?uris=${encodedUri}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${authToken()}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    }
  );
}

musicFestivalButton.onclick = () => {
  let topTracks;
  confirmationElement.innerHTML = "Your festival has been created!";
  const topArtists = getTopArtists();
  topArtists.then((result) => {
    topTracks = getTopTracks(result.topArtistsArrayId);
    topTracks.then((result) => {
      setTimeout(() => {
        const lineUp = document.getElementById("line-up")
      
        const finalResult = result;
        timeTable.map((hour, index) => {
          const artistCard = document.createElement("div");
          artistCard.classList.add("artist-card");
          
          const artistHour = document.createElement("p");
          const contentHours = document.createTextNode(hour);
          artistHour.appendChild(contentHours);

          const artistName = document.createElement("p");
          const contentArtists = document.createTextNode(
            finalResult[index].artist
          );
          artistName.appendChild(contentArtists);
          
          //const artistImage;
          //artistCard.style.backgroundImage = url(artistImage);

          artistCard.appendChild(artistHour);
          artistCard.appendChild(artistName);
          lineUp.appendChild(artistCard);
        });
      }, 100);
    });
  });
  setTimeout(() => {
    generateMusicFestivalPlaylist(topTracks);
  }, 1000);
};
