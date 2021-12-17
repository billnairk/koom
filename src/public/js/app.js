const socket = io.connect("http://localhost:3000");

const welcomeDiv = document.querySelector("#welcome");
const welcomeForm = document.querySelector("form");
const roomDiv = document.getElementById("room");

roomDiv.hidden = true;
let roomName;

function showRoom() {
    welcomeDiv.hidden = true;
    roomDiv.hidden = false;
    const h3 = roomDiv.querySelector("h3");
    h3.innerHTML = `Room : ${roomName}`;
}

welcomeForm.addEventListener("submit", event => {
    event.preventDefault();
    const input = welcomeForm.querySelector("input");
    socket.emit("enter_room", input.value, showRoom);
    roomName = input.value;
    input.value = "";
});
