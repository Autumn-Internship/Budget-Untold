import { authToken, getUserId, upsertPlaylistCollection } from './user-data.js';
import {
  getTopArtists,
  getTopArtistsTracks,
  getEmptyPlaylistId,
  addTracksToPlaylist,
} from './spotify-requests.js';

const confirmationElement = document.getElementById('confirmation-message');
const confirmationButton = document.getElementById('confirmation-button');
const confirmationOverlay = document.getElementById('confirmation-overlay');
const succesfulConfirmation = document.getElementById('succesful-confirmation');

const createOwnForm = document.getElementById('create-own-form');
const formInnerContent = document.getElementById('create-own-form-inner');

async function getRelatedArtists() {
  const topArtistsResponse = await getTopArtists();
  const topArtistsId = topArtistsResponse.topArtistsArrayId;

  let relatedArtistFinal = [];

  topArtistsId.map(async (artistId) => {
    const relatedArtists = await fetch(
      `https://api.spotify.com/v1/artists/${artistId}/related-artists`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${authToken()}`,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      }
    );
    let relatedArtistNameFinal = [];
    let relatedArtistIdFinal = [];
    let relatedArtistImageFinal = [];

    const relatedArtistsResponse = await relatedArtists.json();

    const relatedArtistsArray = relatedArtistsResponse.artists.slice(0, 2);

    relatedArtistsArray.map((artist) => {
      relatedArtistNameFinal.push(artist.name);
      relatedArtistIdFinal.push(artist.id);
      relatedArtistImageFinal.push(artist.images[2].url);
    });

    const relatedArtist = await {
      name: relatedArtistNameFinal,
      id: relatedArtistIdFinal,
      imageUrl: relatedArtistImageFinal,
    };

    relatedArtistFinal.push(relatedArtist);
  });
  return relatedArtistFinal;
}

async function getTopAndRelatedArtists() {
  const topAndRelatedArtistsData = [];
  const topArtistsResponse = await getTopArtists();

  const relatedArtistsResponse = await getRelatedArtists();

  let promise = new Promise(function (resolve, reject) {
    setTimeout(() => {
      relatedArtistsResponse.map((relatedArtist, index) => {
        let artistObject = {
          artistObjectName: [],
          artistObjectId: [],
          artistObjectUrl: [],
        };

        const concatenatedRelatedTopArtistNames = relatedArtist.name.concat(
          topArtistsResponse.topArtistsArrayName[index]
        );
        const concatenatedRelatedTopArtistIds = relatedArtist.id.concat(
          topArtistsResponse.topArtistsArrayId[index]
        );
        const concatenatedRelatedTopArtistUrls = relatedArtist.imageUrl.concat(
          topArtistsResponse.topArtistsArrayImage[index]
        );

        artistObject.artistObjectName.push(
          ...concatenatedRelatedTopArtistNames
        );
        artistObject.artistObjectId.push(...concatenatedRelatedTopArtistIds);

        artistObject.artistObjectUrl.push(...concatenatedRelatedTopArtistUrls);

        topAndRelatedArtistsData.push(artistObject);
      });

      resolve(topAndRelatedArtistsData);
    }, 1000);
  });
  return promise;
}

async function generateCheckboxes(artists) {
  for (let i = 0; i < artists.length; i++) {
    const label = document.createElement('label');

    let checkbox = document.createElement('input');
    checkbox.type = 'checkbox';

    let customCheckbox = document.createElement('span');

    let randomNumber = Math.floor(Math.random() * 2);
    checkbox.id = artists[i].artistObjectId[randomNumber];
    checkbox.name = artists[i].artistObjectName[randomNumber];

    let image = new Image(200, 200);
    image.src = artists[i].artistObjectUrl[randomNumber];

    const artistName = document.createElement('span');
    artistName.innerHTML = artists[i].artistObjectName[randomNumber];
    artistName.className = 'checkbox-artist-name';

    checkbox.className = 'default-checkbox';
    customCheckbox.className = 'custom-checkbox';
    label.className = 'checkbox-label';
    
    label.appendChild(checkbox);
    label.appendChild(customCheckbox)
    customCheckbox.appendChild(image);
    label.appendChild(artistName);

    formInnerContent.appendChild(label);
  }

  let buttonSubmit = document.createElement('button');
  buttonSubmit.type = 'submit';
  buttonSubmit.id = 'create-own-form-button';
  buttonSubmit.className = 'main-button';
  buttonSubmit.innerHTML = 'Submit';

  createOwnForm.appendChild(buttonSubmit);
}

function renderArtists() {
  try {
    getTopAndRelatedArtists().then((result) => {
      generateCheckboxes(result);
    });
  } catch {
    console.log('Sometimes went wrong');
  }
}

async function generateMakeOwnPlaylist(checkedIdsArray, playlistName, playlistDescription) {
  const playlistId = await getEmptyPlaylistId(
    playlistName,
    playlistDescription
  );
  let tracksUris = [];
  for (let artistId of checkedIdsArray) {
    let topTracksObj = await getTopArtistsTracks(artistId);
    let topTracks = topTracksObj.tracks;
    for (let track of topTracks) {
      tracksUris.push(track.uri);
    }
  }
  addTracksToPlaylist(tracksUris, playlistId);
      return playlistId;
}

createOwnForm.addEventListener('submit', async function (event) {
  event.preventDefault();
  confirmationOverlay.style.display = 'flex';
  try {
    let data = new FormData(createOwnForm);
    let playlistName = data.get('name');
    let playlistDescription = data.get('description');

    const checkedIdsArray = [];
    const checkedArtistsInputs = document.querySelectorAll(
      'input[type="checkbox"]'
    );
  
    for (let i = 0; i < checkedArtistsInputs.length; i++) {
      if (checkedArtistsInputs[i].checked) {
        checkedIdsArray.push(checkedArtistsInputs[i].id);
      }
    }

    const playlistId = await generateMakeOwnPlaylist(checkedIdsArray, playlistName, playlistDescription);
    
    confirmationElement.innerText = 'Your festival has been created!';
    confirmationButton.innerHTML = 'Great!';

    const userId = await getUserId();
    await upsertPlaylistCollection(userId, playlistId, 'create-own-festival');
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

renderArtists();