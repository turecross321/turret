const express = require("express");
const app = express();
const server = require("http").createServer(app);
const WebSocket = require("ws");
const path = require("path");
const websocketController = require("./websocket-commands");
const config = require("./config").config;
const cv = require("@u4/opencv4nodejs");

const wss = new WebSocket.Server({ server: server });
const maxClients = 1;

const vCap = new cv.VideoCapture(0);

let clients = [];
wss.on("connection", function connection(ws) {
  if (clients.length >= maxClients) {
    console.log("denying additional client");
    ws.close(4001, "Too many clients connected");
    return;
  }

  clients.push(ws);
  console.log("new client connected");

  ws.onmessage = function (message) {
    websocketController.processMessage(ws, message);
  };

  ws.on("close", function close(code, reason) {
    clients = clients.filter(function (item) {
      return item !== ws;
    });
  });

  setInterval(() => {
    let frame = vCap.read();
    const encoded = cv
      .imencode(".jpg", frame, [cv.IMWRITE_JPEG_OPTIMIZE, 80])
      .toString("base64");
    ws.send(JSON.stringify({ video: encoded }));
  }, 1000 / config.cameraFPS);
});

app.get("/", function (req, res) {
  res.redirect("/client/index.html");
});

app.get("/client/:resource", function (req, res) {
  res.sendFile(path.join(__dirname, "/client/", req.params.resource));
});

server.listen(config.port, () => console.log("Listen on port " + config.port));
