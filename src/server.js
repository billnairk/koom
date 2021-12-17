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
                        aSocket.send(welcomeMsg(userNick))
                    );
                } else {
                    const oldName = userNick;
                    userNick = parsed.payload;
                    sockets.forEach(aSocket =>
                        aSocket.send(changeUserName(userNick, oldName))
                    );
                }
                break;
            case "new_message":
                const userMsg = parsed.payload;
                sockets.forEach(aSocket =>
                    aSocket.send(makeServerJson(userNick, userMsg))
                );
                break;
        }
    });
});

function changeUserName(cName, oName) {
    const changeName = { cName, oName };
    return JSON.stringify(changeName);
}

function welcomeMsg(wUser) {
    const make = { wUser };
    return JSON.stringify(make);
}

function makeServerJson(userNick, userMsg) {
    const make = { userNick, userMsg };
    return JSON.stringify(make);
}

server.listen(3000, handleListen);
