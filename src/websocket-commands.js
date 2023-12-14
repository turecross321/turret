const Gpio = require("pigpio").Gpio;
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
      sendMessage(ws, "yall suck");
      break;
    default:
      sendMessage(ws, "Unknown command. Type 'HELP' for help.");
  }
};

let servo_x;
let servo_y;
function initializeGpio() {
  servo_x = new Gpio(config.pin_servo_x, { mode: Gpio.OUTPUT });
  servo_y = new Gpio(config.pin_servo_y, { mode: Gpio.OUTPUT });
}

function sendMessage(ws, content) {
  ws.send({ message: content });
}

function setServos(x, y) {
  if (!servo_x || !servo_y) {
    initializeGpio();
  }

  servo_x.servoWrite(x);
  servo_y.servoWrite(y);
}

function setShooting(value) {
  console.log("Shooting = " + value);
}
