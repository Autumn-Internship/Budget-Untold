export const authToken = () => { 
    return localStorage.getItem('access_token');
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

export async function hasPremiumAccount() {
    let userData = await getCurrentUser();
    let userProduct = userData.product;
    console.log(userProduct);
    if(userProduct === 'premium') {
        return true
    } else {
        return false;
    }
}