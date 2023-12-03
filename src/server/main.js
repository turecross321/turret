const express = require("express");
const app = express();
const server = require("http").createServer(app);
const WebSocket = require("ws");

const wss = new WebSocket.Server({ server: server });

const maxClients = 1;
let clients = [];

wss.on("connection", function connection(ws) {
  if (clients.length >= maxClients) {
    console.log("denying additional client");
    ws.close(4001, "Too many clients connected");
    return;
  }

  clients.push(ws);
  console.log("new client connected");

  ws.on("message", function incoming(message) {
    console.log("received: %s", message);
  });

  ws.on("close", function close(code, reason) {
    clients = clients.filter(function (item) {
      return item !== ws;
    });
  });
});

app.get("/", (req, res) => res.send("yo"));

server.listen(3000, () => console.log("Listen on port 3000"));
