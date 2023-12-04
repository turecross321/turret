const url = window.location.hostname + ":" + window.location.port;

function connect() {
  const socket = new WebSocket("ws://" + url);
  const disconnectButton = document.getElementById("disconnectButton");
  disconnectButton.onclick = function () {
    socket.close();
  };

  socket.addEventListener("open", onConnect);
  socket.addEventListener("close", onClose);
  socket.addEventListener("message", function (event) {
    logMessage(event.data);
  });

  document.getElementById("mouseArea").onmousemove = function (event) {
    const x = (event.clientX / event.target.offsetWidth) * 2 - 1;
    const y = (event.clientY / event.target.offsetHeight) * -2 + 1;

    const message = "SERVO" + " " + x + " " + y;
    socket.send(message);
  };
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

function logMessage(message) {
  const logs = document.getElementById("logs");
  const para = document.createElement("span");
  const node = document.createTextNode(message);
  para.appendChild(node);
  logs.insertBefore(para, logs.firstChild);
}
