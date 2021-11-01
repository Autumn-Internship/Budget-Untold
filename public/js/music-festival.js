import { authToken } from "./user-data.js";
import { getUserId } from "./user-data.js";

export async function getTopArtists() {
  const topArtists = await fetch(
    "https://api.spotify.com/v1/me/top/artists?limit=10&time_range=long_term",
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${authToken()}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    }
  );
  const topArtistsResponse = await topArtists.json();
  const topArtistsArrayName = [];
  const topArtistsArrayId = [];
  topArtistsResponse.items.map((artist) => {
    topArtistsArrayName.push(artist.name);
    topArtistsArrayId.push(artist.id);
  });
  const topArtistsObject = await {
    topArtistsArrayName,
    topArtistsArrayId,
  };
  return topArtistsObject;
}

export async function getTopTracks(artistIdArray) {
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
    const topTracksResponse = await topTracks.json();

    topTracksResponse.tracks.map((track) => trackArray.push(track.name));
    
    trackArray=trackArray.slice(0,5).reverse();
    const finalTracksAndArtists = {
      artist: topTracksResponse.tracks[0].album.artists[0].name,
      tracks: trackArray,
    };

    arrayTop.push(finalTracksAndArtists);
    //console.log(await finalTracksAndArtists);
  });
  return arrayTop;
}
