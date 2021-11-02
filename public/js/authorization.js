const { OAuth2AuthCodePKCE } = window.OAuth2AuthCodePKCE;

const oauth = new OAuth2AuthCodePKCE({
  authorizationUrl: "https://accounts.spotify.com/authorize",
  tokenUrl: "https://accounts.spotify.com/api/token",
  clientId: "685a9551c89c41c79e76a35cbc55eb40",
  scopes: [
    "user-read-private",
    "user-read-email",
    "playlist-modify-public",
    "playlist-modify-private",
  ],
  redirectUrl: "http://127.0.0.1:8080/menu.html",
  onAccessTokenExpiry(refreshAccessToken) {
    console.log("Expired! Access token needs to be renewed.");
    alert(
      "We will try to get a new access token via grant code or refresh token."
    );
    return refreshAccessToken();
  },
  onInvalidGrant(refreshAuthCodeOrRefreshToken) {
    console.log("Expired! Auth code or refresh token needs to be renewed.");
    alert("Redirecting to auth server to obtain a new auth grant code.");
    //return refreshAuthCodeOrRefreshToken();
  },
});

function authorize() {
  oauth.fetchAuthorizationCode();
}

oauth
  .isReturningFromAuthServer()
  .then((hasAuthCode) => {
    if (!hasAuthCode) {
      console.log("Something wrong...no auth code.");
    }
    return oauth.getAccessToken();
  })
  .catch((potentialError) => {
    if (potentialError) {
      console.log(potentialError);
    }
  });
