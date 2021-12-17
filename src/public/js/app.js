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

function showRoom() {
  welcomeDiv.hidden = true;
  roomDiv.hidden = false;
  const h3 = roomDiv.querySelector("h3");
  h3.innerHTML = `Room : ${roomName}`;
}

welcomeForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const input = welcomeForm.querySelector("input");
  socket.emit("enter_room", input.value, showRoom);
  roomName = input.value;
  input.value = "";
});

socket.on("welcomeMsg", () => {
  showMessage("누가 방에 들어왔습니다!");
});
