const socket = io.connect("http://localhost:3000");

const welcomeDiv = document.querySelector("#welcome");
const welcomeForm = document.querySelector("form");
const roomDiv = document.getElementById("room");

roomDiv.hidden = true;
let roomName;

function showMessage(msg) {
    const ul = roomDiv.querySelector("ul");
    const li = document.createElement("li");
    li.innerText = msg;
    ul.appendChild(li);
}

function handleMessageSubmit(event) {
    event.preventDefault();
    const input = roomDiv.querySelector("#msg input");
    const value = input.value;
    socket.emit("new_message", input.value, roomName, () => {
        showMessage(`You: ${value}`);
    });
    input.value = "";
}

function handleNickNameSubmit(event) {
    event.preventDefault();
    const input = roomDiv.querySelector("#name input");
    socket.emit("nickname", input.value);
    input.value = "";
}

function showRoom() {
    welcomeDiv.hidden = true;
    roomDiv.hidden = false;
    const h3 = roomDiv.querySelector("h3");
    h3.innerHTML = `Room : ${roomName}`;
    const msgForm = roomDiv.querySelector("#msg");
    const nameForm = roomDiv.querySelector("#name");
    msgForm.addEventListener("submit", handleMessageSubmit);
    nameForm.addEventListener("submit", handleNickNameSubmit);
}

welcomeForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const input = welcomeForm.querySelector("input");
    socket.emit("enter_room", input.value, showRoom);
    roomName = input.value;
    input.value = "";
});

socket.on("welcomeMsg", (user) => {
    showMessage(`${user}님이 입장하셨습니다.`);
});

socket.on("bye", (user) => {
    showMessage(`${user}님이 퇴장하셨습니다.`);
});

socket.on("new_message", (msg, user) => {
    showMessage(`${user}: ${msg}`);
});
