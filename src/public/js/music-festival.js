import { getUserId } from "./user-data.js";
import { timeTable } from "./data.js";
import {
  getTopArtists,
  getEmptyPlaylistId,
  getTopArtistsTracks,
  addTracksToPlaylist,
} from "./spotify-requests.js";
import { postPlaylistCollection } from "./playlists-list.js";


const confirmationElement = document.getElementById("confirmation-message");
const musicFestivalButton = document.getElementById("music-festival-button");


async function getTopTracksObj(artistIdsArray) {
  let arrayTop = [];

  artistIdsArray.map(async (artistId) => {
    let trackArray = [];
    let uriArray = [];
    const topTracks = await getTopArtistsTracks(artistId);

    topTracks.tracks.map((track) => {
      trackArray.push(track.name);
      uriArray.push(track.uri);
    });

    trackArray = trackArray.slice(0, 5).reverse();
    uriArray = uriArray.slice(0, 5).reverse();

    const finalTracksAndArtists = {
      artist: topTracks.tracks[0].album.artists[0].name,
      tracks: trackArray,
      uri: uriArray,
    };

    arrayTop.push(finalTracksAndArtists);
  });
  return arrayTop;
}

async function generateMusicFestivalPlaylist(topTracks) {
  const topTracksForPlaylist = await topTracks;
  const playlistId = await getEmptyPlaylistId(
    "Music Festival",
    "The coolest playlist"
  );

  const uriFinalArray = [];
  topTracksForPlaylist.map((finalTracksAndArtists) => {
    finalTracksAndArtists.uri.map((uri) => {
      uriFinalArray.push(uri);
    });
  });

  let resultUri = [];
  uriFinalArray.map((element) => resultUri.push(element));
  addTracksToPlaylist(resultUri, playlistId);

  return playlistId;
}

musicFestivalButton.onclick = () => {
  let topTracks;
  let topArtistsImage;
  confirmationElement.innerHTML = "Your festival has been created!";
  const topArtists = getTopArtists();
  topArtists.then((result) => {
    topArtistsImage = result.topArtistsArrayImage;
    topTracks = getTopTracksObj(result.topArtistsArrayId);
    topTracks.then((result) => {
      setTimeout(() => {
        const lineUp = document.getElementById("line-up");

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

          const artistImage = topArtistsImage[index];
          artistCard.style.backgroundImage = "url(" + artistImage + ")";

          artistCard.appendChild(artistHour);
          artistCard.appendChild(artistName);
          lineUp.appendChild(artistCard);
        });
      }, 100);
    });
  });
  setTimeout(async () => {
    const userId = await getUserId();
    const playlistId = await generateMusicFestivalPlaylist(topTracks);
    console.log("Userid:", userId);
    console.log("playid:", playlistId);
    postPlaylistCollection(userId, playlistId, "music-festival");
  }, 1000);
};
