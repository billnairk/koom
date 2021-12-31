const socket = io.connect("http://localhost:3000");

const welcomeDiv = document.querySelector("#welcome"); // 메인 화면
const loginForm = document.querySelector("#login");
const joinForm = document.querySelector("#join");
const roomDiv = document.getElementById("room");
const chatDiv = roomDiv.querySelector("ul");
const roomListDiv = document.querySelector("#roomList");
const roomNameInList = document.querySelector(".room");

roomDiv.hidden = true;
joinForm.hidden = true;
roomList.hidden = true;
let roomName;

function showMessage(msg) {
    const ul = roomDiv.querySelector("ul");
    const li = document.createElement("li");
    li.innerText = msg;
    ul.appendChild(li);
    chatDiv.scrollTop = chatDiv.scrollHeight;
}

function handleMessageSubmit(event) {
    event.preventDefault();
    const input = roomDiv.querySelector("#msg input");
    const value = input.value;
    socket.emit("new_message", input.value, roomName, () => {
        showMessage(`You: ${value}`);
    });
    input.value = "";
    // console.log(`scrollHeight: ${chatDiv.scrollHeight}`);
    // console.log(`clientHeight: ${chatDiv.clientHeight}`);
    // console.log(`scrollTop: ${chatDiv.scrollTop}`);
}

function showRoom() {
    roomDiv.hidden = false;
    const h3 = roomDiv.querySelector("h3");
    h3.innerHTML = `채팅방: ${roomName}`;
    const chatBoard = roomDiv.querySelector("#room ul");
    chatBoard.innerHTML = "";
    const msgForm = roomDiv.querySelector("#msg");
    msgForm.addEventListener("submit", handleMessageSubmit);
}

function disconnectRoom(roomName) {
    if (roomName != undefined) {
        socket.emit("out_room", roomName);
    }
}

loginForm.addEventListener("submit", event => {
    event.preventDefault();
    const input = loginForm.querySelector("input");
    socket.emit("nickname", input.value);
    input.value = "";
    loginForm.hidden = true;
    joinForm.hidden = false;
    roomList.hidden = false;
});

joinForm.addEventListener("submit", event => {
    event.preventDefault();
    const input = joinForm.querySelector("input");
    disconnectRoom(roomName);
    socket.emit("enter_room", input.value, showRoom);
    roomName = input.value;
    input.value = "";
});

socket.on("roomConnectMsg", user => {
    showMessage(`${user}님이 입장하셨습니다.`);
});

socket.on("bye", user => {
    showMessage(`${user}님이 퇴장하셨습니다.`);
});

socket.on("new_message", (msg, user) => {
    showMessage(`${user}: ${msg}`);
});

socket.on("welcomeMsg", user => {
    showMessage(`${user}님 즐거운 하루 되세요.`);
});

socket.on("showRoomList", rooms => {
    const roomList = roomListDiv.querySelector("ul");
    roomList.innerHTML = "";
    rooms.forEach(room => {
        if (room !== roomName) {
            const li = document.createElement("li");
            li.classList.add("room");
            li.innerText = room;
            roomList.appendChild(li);
            li.addEventListener("click", event => {
                disconnectRoom(roomName);
                socket.emit("enter_room", li.textContent, showRoom);
                roomName = li.textContent;
            });
        }
    });
});
