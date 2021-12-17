import http from "http";
import express from "express";
import WebSocket from "ws";

const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));
app.get("/", (req, res) => res.render("home"));
app.get("/*", (req, res) => res.redirect("/"));
const handleListen = () => console.log("Create Server!");

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });
const sockets = [];

wss.on("connection", socket => {
    sockets.push(socket);
    let userNick = "Anonymous";
    console.log("Connected to Browser ✅");
    socket.on("close", () => console.log("Disconnected from Browser ❌"));
    socket.on("message", message => {
        const parsed = JSON.parse(message);
        switch (parsed.type) {
            case "nick":
                if (userNick == "Anonymous") {
                    userNick = parsed.payload;
                    sockets.forEach(aSocket =>
                        aSocket.send(`${userNick}님이 접속하셨습니다.`)
                    );
                } else {
                    const oldName = userNick;
                    userNick = parsed.payload;
                    sockets.forEach(aSocket =>
                        aSocket.send(
                            `${oldName}님이 닉네임을 ${userNick}(으)로 변경하셨습니다.`
                        )
                    );
                }
                break;
            case "new_message":
                const userMsg = parsed.payload;
                sockets.forEach(aSocket =>
                    aSocket.send(`${userNick}: ${userMsg}`)
                );
                break;
        }
    });
});

server.listen(3000, handleListen);
