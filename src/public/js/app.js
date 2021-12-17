const messageList = document.querySelector("ul");
const nickForm = document.querySelector("#nick");
const messageForm = document.querySelector("#message");
const socket = new WebSocket(`ws://${window.location.host}`);

socket.addEventListener("open", () => console.log("Server to Connected ✅"));
socket.addEventListener("close", () =>
    console.log("Disconnected from Server ❌")
);

// 브라우저에 메시지 출력
socket.addEventListener("message", msg => {
    const li = document.createElement("li");
    const data = JSON.parse(msg.data);
    if (data.userMsg) {
        li.innerText = `${data.userNick}: ${data.userMsg}`;
    } else if (data.wUser) {
        li.innerText = `${data.wUser}님이 접속하셨습니다.`;
    } else if (data.cName) {
        li.innerText = `${data.oName}님이 닉네임을 ${data.cName}(으)로 변경하였습니다.`;
    }
    messageList.appendChild(li);
});

// 메시지를 객체화 시킨 후 스트링으로 리턴
function makeMsg(type, payload) {
    const msg = { type, payload };
    return JSON.stringify(msg);
}

// 메시지 입력
messageForm.addEventListener("submit", event => {
    event.preventDefault();
    const input = messageForm.querySelector("input");
    socket.send(makeMsg("new_message", input.value));
    input.value = "";
});

// 닉네임 입력
nickForm.addEventListener("submit", event => {
    event.preventDefault();
    const input = nickForm.querySelector("input");
    socket.send(makeMsg("nick", input.value));
    input.value = "";
});
