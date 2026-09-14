
async function getUser() {
    const response = await fetch('http://127.0.0.1:5000/get-user')
    const user = await response.json()
    return user
}

async function updateUser() {
    const userUsername = document.querySelector('.user-username');
    const userUserId = document.querySelector('.user-user-id');

    const user = await getUser();

    userUsername.innerText = user['username'];
    userUserId.innerText = `user-id: ${user['user-id']}`
}

updateUser()