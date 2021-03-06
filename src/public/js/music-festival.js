import { getUserId, upsertPlaylistCollection } from './user-data.js';
import { timeTable } from './data.js';
import {
  getTopArtists,
  getEmptyPlaylistId,
  getTopArtistsTracks,
  addTracksToPlaylist,
} from './spotify-requests.js';

const confirmationElement = document.getElementById('confirmation-message');
const confirmationButton = document.getElementById('confirmation-button');
const confirmationOverlay = document.getElementById('confirmation-overlay');
const succesfulConfirmation = document.getElementById('succesful-confirmation');

const musicFestivalForm = document.getElementById('music-festival-form');
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

async function generateMusicFestivalPlaylist(topTracks, playlistName, playlistDescription) {
  const topTracksForPlaylist = await topTracks;
  const playlistId = await getEmptyPlaylistId(
    playlistName,
    playlistDescription
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
  const lineUp = document.getElementById('line-up');

  timeTable.map((hour, index) => {
    const artistCard = document.createElement('div');
    artistCard.classList.add('artist-card');

    const artistHour = document.createElement('p');
    const contentHours = document.createTextNode(hour);
    artistHour.appendChild(contentHours);

    let nameDisplay = artistNameResult[index];
    const artistName = document.createElement('p');
    const contentArtists = document.createTextNode(nameDisplay);
    artistName.appendChild(contentArtists);

    let imageDisplay = artistImageResult[index];
    artistCard.style.backgroundImage = 'url(' + imageDisplay + ')';

    artistCard.appendChild(artistHour);
    artistCard.appendChild(artistName);
    lineUp.appendChild(artistCard);
  });
}

async function topTracksHelper(playlistName, playlistDescription){
  const topArtists =await getTopArtists();
  let idArtist=topArtists.topArtistsArrayId;
  let topTracks = await getTopTracksObj(idArtist);
  const playlistId = await generateMusicFestivalPlaylist(topTracks, playlistName, playlistDescription);
  return playlistId;
}

musicFestivalForm.addEventListener('submit', async function(event) {
  event.preventDefault();
  confirmationOverlay.style.display = 'flex';
  try {
    const data = new FormData(musicFestivalForm);
    const playlistName = data.get('name');
    const playlistDescription = data.get('description');

    let playlistId = await topTracksHelper(playlistName, playlistDescription);
    confirmationElement.innerHTML = 'Your festival has been created!';
    confirmationButton.innerHTML = 'Great!';

    upsertPlaylistCollection(userId, playlistId, 'music-festival');
    displayArtists();
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
