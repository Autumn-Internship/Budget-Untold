import { getUserId, upsertPlaylistCollection } from "./user-data.js";
import { timeTable } from "./data.js";
import {
  getTopArtists,
  getEmptyPlaylistId,
  getTopArtistsTracks,
  addTracksToPlaylist,
} from "./spotify-requests.js";
import { patchPlaylistCollection } from "./playlists-list.js";

const confirmationElement = document.getElementById("confirmation-message");
const musicFestivalButton = document.getElementById("music-festival-button");
const userId = await getUserId();

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
    "Music Festival Generate",
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

async function displayArtists() {
  const result = await getTopArtists();

  const artistNameResult = result.topArtistsArrayName;
  const artistImageResult = result.topArtistsArrayImage;
  const lineUp = document.getElementById("line-up");

  timeTable.map((hour, index) => {
    const artistCard = document.createElement("div");
    artistCard.classList.add("artist-card");

    const artistHour = document.createElement("p");
    const contentHours = document.createTextNode(hour);
    artistHour.appendChild(contentHours);

    let nameDisplay = artistNameResult[index];
    const artistName = document.createElement("p");
    const contentArtists = document.createTextNode(nameDisplay);
    artistName.appendChild(contentArtists);

    let imageDisplay = artistImageResult[index];
    artistCard.style.backgroundImage = "url(" + imageDisplay + ")";

    artistCard.appendChild(artistHour);
    artistCard.appendChild(artistName);
    lineUp.appendChild(artistCard);
  });
}

async function topTracksHelper(){
  const topArtists =await getTopArtists();
  let idArtist=topArtists.topArtistsArrayId;
  let topTracks = await getTopTracksObj(idArtist);
  const playlistId = await generateMusicFestivalPlaylist(topTracks);
  return playlistId;
}

musicFestivalButton.onclick = async() => {
  let playlistId=await topTracksHelper();
  confirmationElement.innerHTML = "Your festival has been created!";
  patchPlaylistCollection(userId, playlistId, "music-festival");
  displayArtists();
};
