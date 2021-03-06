'use strict';

const socket = io();
socket.on('message', ({ author, content }) => addMessage(author, content));
socket.on('newUser', (user) => addMessage('Chat Bot', user + ' has joined the conversation!'));
socket.on('removeUser', (userName) => addMessage('Chat Bot', userName + ' has left the conversation!'));


const loginForm = document.getElementById('welcome-form');
const messagesSection = document.getElementById('messages-section');
const messagesList = document.getElementById('messages-list');
const addMessageForm = document.getElementById('add-messages-form');
const userNameInput = document.getElementById('username');
const messageContentInput = document.getElementById('message-content');

let userName = '';


function login(event) {
  event.preventDefault();
    
  if (!userNameInput.value) {
    alert('User name field is empty');  

  } else {
    userName = userNameInput.value;

    loginForm.classList.remove('show');
    messagesSection.classList.add('show');
    socket.emit('join', userName);
  }
};

function addMessage (author, content) {
  const message = document.createElement('li');
  message.classList.add('message');
  message.classList.add('message--received');

  if(author === userName) {
    message.classList.add('message--self');
  }

  if(author === 'Chat Bot') {
    message.classList.add('message--chatBot');
  }

  message.innerHTML = `
    <h3 class="message__author">${author === userName ? 'You' : author}</h3>  
    <div class="message__content">
    ${content}
    </div> 
    `;
  messagesList.appendChild(message);
}

function sendMessage(e) {
  e.preventDefault();
  
  if (!messageContentInput.value) {
    alert('User message field is empty');
  } else {
    addMessage(userName, messageContentInput.value);
  }

  socket.emit('message', { author: userName, content: messageContentInput.value });

  messageContentInput.value = '';
};

loginForm.addEventListener('submit', (event) => {
  login(event);
});

addMessageForm.addEventListener('submit', (event) => {
  sendMessage(event);
});

