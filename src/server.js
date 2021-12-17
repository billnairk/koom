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
    let user = "Anonymous";
    console.log("Connected to Browser ✅");
    socket.on("close", () => console.log("Disconnected from Browser ❌"));
    socket.on("message", message => {
        if (JSON.parse(message).type === "nick") {
            if (user == "Anonymous") {
                user = JSON.parse(message).payload;
                sockets.forEach(aSocket => aSocket.send(welcomeMsg(user)));
            } else {
                const oldName = user;
                user = JSON.parse(message).payload;
                sockets.forEach(aSocket =>
                    aSocket.send(changeUserName(user, oldName))
                );
            }
        }
        if (JSON.parse(message).type === "new_message") {
            const userMsg = JSON.parse(message).payload;
            sockets.forEach(aSocket =>
                aSocket.send(makeServerJson(user, userMsg))
            );
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

function makeServerJson(user, userMsg) {
    const make = { user, userMsg };
    return JSON.stringify(make);
}

server.listen(3000, handleListen);
