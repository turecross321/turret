const config = require("./config").config;

exports.processMessage = (ws, message) => {
  args = message.data.split(" ");
  command = args[0].toLowerCase();
  params = args.slice(1);

  switch (command) {
    case "servo":
      const x = params[0];
      const y = params[1];
      setServos(x, y);
      break;
    case "shoot":
      const value = params[0];
      setShooting(value);
      break;
    case "help":
      ws.send("this guy needs help");
      break;
    default:
      ws.send("Unknown command. Type 'HELP' for help.");
  }
};

function setServos(x, y) {
  console.log("x: %d| y: %d", x, y);
}

function setShooting(value) {
  console.log("Shooting = " + value);
}
