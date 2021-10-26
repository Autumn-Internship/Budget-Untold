export function getAlbum() {
    fetch("https://api.spotify.com/v1/albums/4aawyAB9vmqN3uQ7FjRGTy",
    {"method":"GET", 
    "headers": {
        'Authorization':`Bearer ${JSON.parse(localStorage.getItem('oauth2authcodepkce-state')).accessToken.value}`,
        'Content-Type': 'application/json'}
    }).then( (res) => res.json()).then( (data) => console.log('data: ', data));
}

const userName = 'Maria';
const userNameElement = document.getElementById('user-name');
const confirmationElement = document.getElementById('confirmation-message');
const musicFestivalButton = document.getElementById('music-festival-button');

userNameElement.innerHTML = userName;

musicFestivalButton.onclick = () => {
   confirmationElement.innerHTML = 'Your festival has been created!';
}