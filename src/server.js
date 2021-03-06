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

httpServer.listen(3000, handleListen);
