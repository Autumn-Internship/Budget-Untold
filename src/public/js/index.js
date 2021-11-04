import { followCountryPlaylist, addOptions } from "./around-world.js";
import { getUserDisplayName } from "./user-data.js";
import {
  categoryIdList,
  marketCodes,
  countryCodes,
  timeTable,
} from "./data.js";
import {
  getTopArtists,
  getTopTracks,
  generateMusicFestivalPlaylist,
} from "./music-festival.js";
import { getTopAndRelatedArtists, generateCheckboxes } from "./create-own.js";

const userNameElement = document.getElementById("user-name");

const confirmationElement = document.getElementById("confirmation-message");

export let worldForm = document.getElementById("world-form");
const countriesList = document.getElementById("countriesList");
const categoriesList = document.getElementById("categoriesList");

const musicFestivalButton = document.getElementById("music-festival-button");
const table = document.getElementById("generatePlaylistArtistandTracks");
const theadRow = document.getElementById("theadRow");
const tbody = document.getElementById("tbody");

export let makeOwn = document.getElementById("create-own-button");
export const makeOwnSubmit = document.getElementById("create-own-form");

if (userNameElement) {
  const userName = await getUserDisplayName();
  userNameElement.innerHTML = userName;
}

if (musicFestivalButton) {
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
}

if (worldForm) {
  if (countriesList) {
    for (let code of marketCodes.markets) {
      addOptions(countriesList, countryCodes[code]);
    }
    for (let category in categoryIdList) {
      addOptions(categoriesList, category);
    }
  }

  worldForm.addEventListener("submit", async function (event) {
    event.preventDefault();
    try {
      await followCountryPlaylist();
      confirmationElement.innerHTML = "Your festival has been created!";
    } catch {
      confirmationElement.innerHTML =
        "Something went wrong. Please try again later.";
    }
  });
}

if (makeOwn) {
  makeOwn.onclick = () => {
    try {
      getTopAndRelatedArtists().then((result) => {
        generateCheckboxes(result);
      });
    } catch {
      console.log("Sometimes went wrong");
    }
  };
}

makeOwnSubmit.addEventListener("submit", async function (event) {
  event.preventDefault();
  makeOwn.disabled = "true";

  const checkedIdArray = [];
  const checkedArtistsInputs = document.querySelectorAll(
    'input[type="checkbox"]'
  );

  for (let i = 0; i < checkedArtistsInputs.length; i++) {
    if (checkedArtistsInputs[i].checked) {
      checkedIdArray.push(checkedArtistsInputs[i].id);
    }
  }
  console.log(checkedIdArray); //final Ids selected
});
