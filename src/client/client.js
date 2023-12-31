const url = window.location.hostname + ":" + window.location.port;
//const url = "192.168.1.195:5000";

let socket = null;
function connect() {
  socket = new WebSocket("ws://" + url);
  const disconnectButton = document.getElementById("disconnectButton");
  disconnectButton.onclick = function () {
    socket.close();
  };

  socket.addEventListener("open", onConnect);
  socket.addEventListener("close", onClose);
  socket.addEventListener("message", function (event) {
    res = JSON.parse(event.data);

    if (res.video) {
      updateVideo(res.video);
    } else if (res.message) {
      logMessage("SERVER", res.message);
    }
  });
}

function onConnect(event) {
  logMessage("INFO", "Connected to server");

  updateElements(true);
}

function onClose(event) {
  logMessage(
    "INFO",
    "Disconnected. Reason: " + event.reason + " (" + event.code + ")"
  );

  updateElements(false);
}

function onSliderXChange(event) {
  x = event.target.value / event.target.max;
  runCommand("x " + x);
}

function onSliderYChange(event) {
  y = event.target.value / event.target.max;
  runCommand("y " + y);
}

function updateElements(connected) {
  const connectedElement = document.getElementById("connected");
  const unConnectedElement = document.getElementById("unconnected");

  if (connected) {
    connectedElement.style.display = "flex";
    unConnectedElement.style.display = "none";
  } else {
    connectedElement.style.display = "none";
    unConnectedElement.style.display = "flex";
  }
}

function logMessage(author, message) {
  const logs = document.getElementById("logs");
  const para = document.createElement("span");
  const node = document.createTextNode("[" + author + "]: " + message);
  para.appendChild(node);
  logs.insertBefore(para, logs.firstChild);
}

let commandInput = null;
function commandInputSubmit(event) {
  event.preventDefault();
  if (!commandInput) {
    commandInput = document.getElementById("commandInput");
  }

  runCommand(commandInput.value);
  commandInput.value = "";
}

function runCommand(command) {
  logMessage("CLIENT", command);
  socket.send(command);
}

let video = undefined;
function updateVideo(frame) {
  video ??= document.getElementById("camera-view");
  video.src = "data:image/png;base64," + frame;
}
