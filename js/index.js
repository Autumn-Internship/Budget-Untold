const userName = 'Maria';
const userNameElement = document.getElementById('user-name');
const confirmationElement = document.getElementById('confirmation-message');

userNameElement.innerHTML = userName;

function confirmGeneration() {
   confirmationElement.innerHTML = 'Your festival has been created!';
}
