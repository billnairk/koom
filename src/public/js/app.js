const messageList = document.querySelector("ul");
const nickForm = document.querySelector("#nick");
const messageForm = document.querySelector("#message");
const socket = new WebSocket(`ws://${window.location.host}`);

socket.addEventListener("open", () => console.log("Server to Connected ✅"));
socket.addEventListener("close", () =>
    console.log("Disconnected from Server ❌")
);

function showMessage(msg) {
    const li = document.createElement("li");
    const data = JSON.parse(msg.data);
    if (data.userMsg) {
        li.innerText = `${data.user}: ${data.userMsg}`;
    } else if (data.wUser) {
        li.innerText = `${data.wUser}님이 접속하셨습니다.`;
    } else if (data.cName) {
        li.innerText = `${data.oName}님이 닉네임을 ${data.cName}(으)로 변경하였습니다.`;
    }
    messageList.appendChild(li);
}

function makeMsg(type, payload) {
    const msg = { type, payload };
    return JSON.stringify(msg);
}

socket.addEventListener("message", showMessage);

function handleSubmit(event) {
    event.preventDefault();
    const input = messageForm.querySelector("input");
    socket.send(makeMsg("new_message", input.value));
    input.value = "";
}

messageForm.addEventListener("submit", handleSubmit);

nickForm.addEventListener("submit", event => {
    event.preventDefault();
    const input = nickForm.querySelector("input");
    socket.send(makeMsg("nick", input.value));
    input.value = "";
});
