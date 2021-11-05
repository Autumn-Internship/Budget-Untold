import { authToken } from "./user-data.js";

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
    const topArtistsArrayImage = [];
    topArtistsResponse.items.map((artist) => {
      topArtistsArrayName.push(artist.name);
      topArtistsArrayId.push(artist.id);
      topArtistsArrayImage.push(artist.images[0].url);
    });
  
    const topArtistsObject = await {
      topArtistsArrayName,
      topArtistsArrayId,
      topArtistsArrayImage,
    };
    return topArtistsObject;
  }