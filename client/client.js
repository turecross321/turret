function sendMessage() {
  socket.send("hello from the Gang");
}

function logMessage(message) {
  const logs = document.getElementById("logs");
  const para = document.createElement("span");
  const node = document.createTextNode(message);
  para.appendChild(node);
  logs.insertBefore(para, logs.firstChild);
}

function connect() {
  const socket = new WebSocket("ws://localhost:3000");
  const disconnectButton = document.getElementById("disconnectButton");
  disconnectButton.onclick = function () {
    socket.close();
  };

  socket.addEventListener("open", onConnect);
  socket.addEventListener("close", onClose);

  socket.addEventListener("message", function (event) {
    console.log("message from server", event.data);
  });
}

function onConnect(event) {
  logMessage("Connected to server");
  console.log("connected to server");

  updateElements(true);
}

function onClose(event) {
  logMessage("Disconnected. Reason: " + event.reason + " (" + event.code + ")");

  updateElements(false);
}

function updateElements(connected) {
  const connectedElement = document.getElementById("connected");
  const unConnectedElement = document.getElementById("unconnected");

  if (connected) {
    connectedElement.style.display = "block";
    unConnectedElement.style.display = "none";
  } else {
    connectedElement.style.display = "none";
    unConnectedElement.style.display = "block";
  }
}
