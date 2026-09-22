
let socketio = io();
async function getMessages() {
    const response = await fetch('/community_messages')
    if (!response.ok){
        throw new Error("Failed to fetch community messages")
    }
    const messages = await response.json()
    return messages
    
}

async function getCurrentUserId() {
    const response = await fetch('/current-user')
    const data = await response.json()
    return data.current_user
}

let currentUserId = null;
async function loadCurrentUserId() {
    currentUserId = await getCurrentUserId();
}


const messageContainer = document.querySelector(".msg-container")
function createMessage(msg){
    
    const messageBox = document.createElement('div');
    messageBox.classList.add('msg-box');
    if (msg.user_id === currentUserId){
        messageBox.classList.add('you')
    }

    const sender = document.createElement('p');
    sender.classList.add('sender')
    if (msg.user_id === currentUserId){
        sender.innerText = 'you'
    } else {
        sender.innerText = msg.username;
    }
    
    

    const message = document.createElement('p');
    message.classList.add('msg')
    message.innerText = msg.msg;

    messageBox.appendChild(sender);
    messageBox.appendChild(message);

    messageContainer.appendChild(messageBox);
}

function smoothScroll(){
    window.scrollTo({
        top: document.documentElement.scrollHeight,
        behavior: "smooth"
    });
}

async function showMessages() {
   
    messageContainer.innerHTML = ''
    const messages = await getMessages()

    for(const msg of messages){
        createMessage(msg);
    }
   
    smoothScroll()

}

async function sendMessage(msg){
    const response = await fetch(`/add-message/${msg}`, ({
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
            socketio.emit("send-message", inputBar.value)
            inputBar.value = '';
        }
})
}



socketio.on('c', (data)=>{
    const connectedMessage = document.createElement('p');
    connectedMessage.classList.add('connected-message')
    connectedMessage.innerText = `${data.username} connected`;
    messageContainer.append(connectedMessage);
    smoothScroll()
})

socketio.on('dc', (data)=>{
    const disConnectedMessage = document.createElement('p');
    disConnectedMessage.classList.add('disconnected-message')
    disConnectedMessage.innerText = `${data.username} disconnected`;
    messageContainer.append(disConnectedMessage)
    smoothScroll()
})

socketio.on('msg-received', (data)=>{
    createMessage(data);
    smoothScroll()
})
async function run() {
    await loadCurrentUserId()
    showMessages()
    initializeMessageBox()
}

run()

