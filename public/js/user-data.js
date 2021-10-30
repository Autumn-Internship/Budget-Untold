export const authToken = () => { 
    return JSON.parse(localStorage.getItem('oauth2authcodepkce-state')).accessToken.value;
}

export async function getCurrentUser() {
    let response = await fetch('https://api.spotify.com/v1/me',
    {'method': 'GET', 
    'headers': {
        'Authorization': `Bearer ${authToken()}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'}
    });
    return response.json();
}
export async function getUserId() {
    let userData = await getCurrentUser();
    const currentUserId = userData.id;
    return currentUserId;
}

export async function getUserDisplayName() {
    let userData = await getCurrentUser();
    const userDisplayName = userData['display_name'];
    return userDisplayName;
}