const chatform = document.getElementById('chat-form');
const chatmessage=document.querySelector('.chat-messages');
const roomname = document.getElementById('room-name');
const userlist= document.getElementById('users');


//get username and room from URL
const {username , room}=Qs.parse(location.search,{
    ignoreQueryPrefix:true
});

//join room
const socket= io();
socket.emit('joinroom',{username,room});

socket.on('roomuser',({ room,users})=>{
    outputroomname(room);
    outputuser(users);

});

socket.on('message',message=>{
    console.log(message);
    outputMessage(message);


    //Scroll down 
    chatmessage.scrollTop=chatmessage.scrollHeight;
});

//message submit

chatform.addEventListener('submit',e=>{
    e.preventDefault();
    const msg=e.target.elements.msg.value;
    console.log(msg);
//emit message to server
    socket.emit("chatmessage",msg);

    e.target.elements.msg.value=''
    e.target.elements.msg.focus();
})

//output message in DOM

function outputMessage(message){
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML=`<p class="meta">${message.username} <span>${message.time}</span></p>
    <p class="text">
        ${message.text}
    </p>`;

    document.querySelector('.chat-messages').appendChild(div)

}

//add room name to DOM
function outputroomname(room){
    roomname.innerText=room;
}

//add user to DOM
function outputuser(users){
    userlist.innerHTML=
    `${users.map(user=>`<li>${user.username}</li>`).join('')}`
      
}