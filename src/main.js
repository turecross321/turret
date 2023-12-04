const express = require("express");
const app = express();
const server = require("http").createServer(app);
const WebSocket = require("ws");
const path = require("path");

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

  ws.onmessage = processMessage;

  ws.on("close", function close(code, reason) {
    clients = clients.filter(function (item) {
      return item !== ws;
    });
  });
});

function processMessage(message) {
  args = message.data.split(" ").slice(1);

  if (message.data.startsWith("SERVO")) {
    const x = args[0];
    const y = args[1];
    setServos(x, y);
  } else if (message.data.startsWith("SHOOT")) {
    const duration = args[0];
    shoot(duration);
  }
}

function setServos(x, y) {
  console.log("x: %d| y: %d", x, y);
}

function shoot(duration) {
  console.log("Starting to shoot");
  setTimeout(function () {
    console.log("STOP");
  }, duration);
}

app.get("/", function (req, res) {
  res.redirect("/client/index.html");
});

app.get("/client/:resource", function (req, res) {
  res.sendFile(path.join(__dirname, "/client/", req.params.resource));
});

server.listen(3000, () => console.log("Listen on port 3000"));
