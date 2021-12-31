import http from "http";
import express from "express";
import SocketIO from "socket.io";

const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));
app.get("/", (req, res) => res.render("home"));
app.get("/list", (req, res) => res.render("list"));
const handleListen = () => console.log("Create Server! http://localhost:3000/");

const httpServer = http.createServer(app);
const wsServer = new SocketIO.Server(httpServer);

function roomList() {
    const {
        sockets: {
            adapter: { rooms, sids },
        },
    } = wsServer;
    const publicRooms = [];
    rooms.forEach((_, key) => {
        if (sids.get(key) === undefined) {
            publicRooms.push(key);
        }
    });
    return publicRooms;
}

wsServer.on("connection", socket => {
    console.log(wsServer.sockets.adapter);
    wsServer.sockets.emit("showRoomList", roomList());
    socket["nickname"] = "익명";
    socket.on("enter_room", (roomName, done) => {
        socket.join(roomName);
        done();
        socket.emit("welcomeMsg", socket.nickname);
        socket.to(roomName).emit("roomConnectMsg", socket.nickname);
        wsServer.sockets.emit("showRoomList", roomList());
    });
    socket.on("out_room", roomName => {
        socket.leave(roomName);
        socket.to(roomName).emit("bye", socket.nickname);
    });
    socket.on("disconnecting", () => {
        socket.rooms.forEach(room => {
            socket.to(room).emit("bye", socket.nickname);
        });
    });
    socket.on("disconnect", () => {
        wsServer.sockets.emit("showRoomList", roomList());
    });
    socket.on("new_message", (msg, roomName, done) => {
        socket.to(roomName).emit("new_message", msg, socket.nickname);
        done();
    });
    socket.on("nickname", nickname => {
        socket["nickname"] = nickname;
    });
});

httpServer.listen(3000, handleListen);
