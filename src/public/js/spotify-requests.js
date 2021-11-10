import { authToken, getUserId } from './user-data.js';

export async function getEmptyPlaylistId(playlistName, description) {
  let userId = await getUserId();
  const emptyPlaylist = await fetch(
    `https://api.spotify.com/v1/users/${userId}/playlists`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${authToken()}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: playlistName,
        description: description,
        public: false,
      }),
    }
  );
  const emptyPlaylistResponse = await emptyPlaylist.json();
  const emptyPlaylistId = emptyPlaylistResponse.id;
  return emptyPlaylistId;
}

export function addTracksToPlaylist(tracks, playlistId, ) {
  fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${authToken()}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        'uris': tracks,
      }),
    }
  );
}

export async function getTopArtists() {
  const topArtists = await fetch(
    'https://api.spotify.com/v1/me/top/artists?limit=20&time_range=long_term',
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${authToken()}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
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
    topArtistsArrayImage.push(artist.images[1].url);
  });

  const topArtistsObject = {
    topArtistsArrayName,
    topArtistsArrayId,
    topArtistsArrayImage,
  };
  return topArtistsObject;
}

export async function getTopArtistsTracks(artistId) {
  const response = await fetch(
    `https://api.spotify.com/v1/artists/${artistId}/top-tracks?market=RO`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${authToken()}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    }
  );
  return response.json();
}

export async function getPlaylistDetails(playlistId) {
  const response = await fetch(
    `https://api.spotify.com/v1/playlists/${playlistId}`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${authToken()}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    }
  );
  const playlistIdResponse = await response.json();
  const playlistName = playlistIdResponse.name;
  const playlistImage = playlistIdResponse.images[0].url;
  const playlistUri = playlistIdResponse.uri;
  const playlistUrl = playlistIdResponse.external_urls.spotify;

  const playlistObject = {
    playlistName, 
    playlistImage,
    playlistUri,
    playlistUrl,
}
return playlistObject;
}

// export async function playPlaylist(playlistUri) {
//   fetch(
//     `https://api.spotify.com/v1/me/player/play`,
//     {
//       method: 'PUT',
//       headers: {
//         Authorization: `Bearer ${authToken()}`,
//         Accept: 'application/json',
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({
//         'context_uri': playlistUri,
//       }),
//     }
//   );
// }