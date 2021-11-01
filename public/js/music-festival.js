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

export async function createPlaylist() {
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

export async function generateMusicFestivalPlaylist(topTracks) {
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
