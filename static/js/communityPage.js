

console.log("Hello")

async function getMessages() {
    const response = await fetch('http://127.0.0.1:5000/community_messages')
    if (!response.ok){
        throw new Error("Failed to fetch community messages")
    }
    const messages = await response.json()
    return messages
    
}


async function showMessages() {
    const messageContainer = document.querySelector(".msg-container")
    messageContainer.innerHTML = ''
    const messages = await getMessages()

    for(const msg of messages){
    const messageBox = document.createElement('div');
    messageBox.classList.add('msg-box');
    if (msg.username === 'you'){
        messageBox.classList.add('you')
    }

    const sender = document.createElement('p');
    sender.classList.add('sender')
    sender.innerText = msg.username;
    

    const message = document.createElement('p');
    message.classList.add('msg')
    message.innerText = msg.msg;

    messageBox.appendChild(sender);
    messageBox.appendChild(message);

    messageContainer.appendChild(messageBox);
    }
   

}

async function sendMessage(msg){
    const response = await fetch(`http://127.0.0.1:5000/add-message/${msg}`, ({
        method:'POST'
    }))
    if (!response.ok){
        throw new Error("Failed to add message")
    }
}

async function initializeMessageBox() {
    const inputBar = document.querySelector('.input-bar');
    const sendButton = document.querySelector('.send-btn');

    sendButton.addEventListener('click', ()=>{
        if (inputBar.value.trim() !== ''){
            sendMessage(inputBar.value);
            inputBar.value = '';
        }
})
}

showMessages()


initializeMessageBox()
