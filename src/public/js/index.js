import { followCountryPlaylist, addOptions } from "./around-world.js";
import { getUserDisplayName } from "./user-data.js";
import { categoryIdList, marketCodes, countryCodes, timeTable} from "./data.js";
import { getTopArtists, getTopTracks, generateMusicFestivalPlaylist } from "./music-festival.js";

const userNameElement = document.getElementById("user-name");

const musicFestivalButton = document.getElementById("music-festival-button");

const confirmationElement = document.getElementById("confirmation-message");

export let worldForm = document.getElementById("world-form");
const countriesList = document.getElementById("countriesList");
const categoriesList = document.getElementById("categoriesList");

const table = document.getElementById("generatePlaylistArtistandTracks");
const theadRow = document.getElementById("theadRow");
const tbody = document.getElementById("tbody");

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
          const tdTimeTable = document.createElement("td");
          const tdArtists = document.createElement("td");
          const tdTracks = document.createElement("td");

          const tdTimeTableText = document.createTextNode("Time Table");
          const tdArtistsText = document.createTextNode("Artists");
          const tdTracksText = document.createTextNode("Tracks");

          tdTimeTable.appendChild(tdTimeTableText);
          tdArtists.appendChild(tdArtistsText);
          tdTracks.appendChild(tdTracksText);

          theadRow.appendChild(tdTimeTable);
          theadRow.appendChild(tdArtists);
          theadRow.appendChild(tdTracks);

          const finalResult = result;
          timeTable.map((hour, index) => {
            const tr = document.createElement("tr");
            const tdHours = document.createElement("td");
            const tdArtists = document.createElement("td");
            const tdTracks = document.createElement("td");

            const contentHours = document.createTextNode(hour);
            tdHours.appendChild(contentHours);

            const contentArtists = document.createTextNode(
              finalResult[index].artist
            );
            tdArtists.appendChild(contentArtists);

            finalResult[index].tracks.map((track) => {
              const contentTrack = document.createTextNode(track);
              const div = document.createElement("div");

              div.appendChild(contentTrack);
              tdTracks.appendChild(div);
            });

            tr.appendChild(tdHours);
            tr.appendChild(tdArtists);
            tr.appendChild(tdTracks);

            tbody.appendChild(tr);
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
