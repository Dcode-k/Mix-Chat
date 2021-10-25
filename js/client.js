const socket= io('http://127.0.0.1:8080');
// get dom elements in respective variables
const form=document.getElementById('send-container');
const messageInput=document.getElementById('messageInp');
const messagecontainer=document.querySelector('.container');
// audio that will play on receiving messages
var messageAudio=new Audio('ting.wav');
// function which will append to the container
const append=(message,position)=>{
    const messageElement=document.createElement('div');
    messageElement.innerText=message;
    messageElement.classList.add('message');
    messageElement.classList.add(position);
    messagecontainer.append(messageElement);
    if(position=='left'){

        messageAudio.play();
    }
}

// ask new user for his or her name and let the server know 
const Name= prompt("Enter your name to join");
socket.emit('new-user-joined',Name);
// if new user joins ,receive his/her name from the server
socket.on('user-joined',name=>{
    append(`${name} joined the chat`,'right');
})
// if server sends the message, receive it
socket.on('receive',data=>{
    append(`${data.name}:${data.message}`,'left');

})
// if the user leaves the chat ,append it to the conatainer
socket.on('left',name=>{
    append(`${name} left the chat`,'left');
})
// if form gets submitted ,send the server the message
form.addEventListener('submit',(e)=>{
   e.preventDefault();
   const message=messageInput.value;
  append(`You:${message}`,'right');
  socket.emit('send',message);
  messageInput.value='';
})