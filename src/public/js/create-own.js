import { authToken, getUserDisplayName, getUserId } from "./user-data.js";
import { getTopArtists, getTopArtistsTracks, getEmptyPlaylistId, addTracksToPlaylist } from "./spotify-requests.js";

const userNameElement = document.getElementById("user-name");
const confirmationElement = document.getElementById("confirmation-message");
let makeOwn = document.getElementById("create-own-button");
const makeOwnSubmit = document.getElementById("create-own-form");

const userName = await getUserDisplayName();
userNameElement.innerHTML = userName;

async function getRelatedArtists() {
  const topArtistsResponse = await getTopArtists();
  const topArtistsId = topArtistsResponse.topArtistsArrayId;

  let relatedArtistFinal = [];

  topArtistsId.map(async (artistId) => {
    const relatedArtists = await fetch(
      `https://api.spotify.com/v1/artists/${artistId}/related-artists`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${authToken()}`,
          Accept: "application/json",
          "Content-Type": "application/json",
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
    const div = document.createElement("div");

    let checkbox = document.createElement("input");
    checkbox.type = "checkbox";

    let randomNumber = Math.floor(Math.random() * 2);
    checkbox.id = artists[i].artistObjectId[randomNumber];
    checkbox.name = artists[i].artistObjectName[randomNumber];

    let image = new Image(100, 100);
    image.src = artists[i].artistObjectUrl[randomNumber];

    const artistName = document.createTextNode(
      artists[i].artistObjectName[randomNumber]
    );
    div.appendChild(image);
    div.appendChild(artistName);
    div.appendChild(checkbox);

    makeOwnSubmit.appendChild(div);
  }

  let buttonSubmit = document.createElement("button");
  buttonSubmit.type = "submit";
  buttonSubmit.id = "create-own-form-button";
  buttonSubmit.className = "main-button";
  buttonSubmit.innerHTML = "Submit";

  makeOwnSubmit.appendChild(buttonSubmit);
}

function renderArtists() {
  try {
    getTopAndRelatedArtists().then((result) => {
      generateCheckboxes(result);
    });
  } catch {
    console.log("Sometimes went wrong");
  }
}

makeOwnSubmit.addEventListener("submit", async function (event) {
  event.preventDefault();
  makeOwn.disabled = "true";

  const checkedIdsArray = [];
  const checkedArtistsInputs = document.querySelectorAll(
    'input[type="checkbox"]'
  );

  for (let i = 0; i < checkedArtistsInputs.length; i++) {
    if (checkedArtistsInputs[i].checked) {
      checkedIdsArray.push(checkedArtistsInputs[i].id);
    }
  }

  async function generateMakeOwnPlaylist() {
    const playlistId = await getEmptyPlaylistId("My playlist", "My favorite artists' top tracks");
    let tracksUris = [];
    for(let artistId of checkedIdsArray) {
      let topTracksObj = await getTopArtistsTracks(artistId);
      let topTracks = topTracksObj.tracks;
      for(let track of topTracks) {
        tracksUris.push(track.uri);
      }
    }
    addTracksToPlaylist(tracksUris, playlistId);
  }
  await generateMakeOwnPlaylist();
});

renderArtists();


