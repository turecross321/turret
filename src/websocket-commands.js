const Gpio = require("pigpio").Gpio;
const config = require("./config").config;

exports.processMessage = (ws, message) => {
  const args = message.data.split(" ");
  const command = args[0].toLowerCase();
  const params = args.slice(1);

  switch (command) {
    case "x":
      const x = params[0];
      setServoX(x);
      break;
    case "y":
      const y = params[0];
      setServoY(y);
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

function setServoX(x) {
  if (!servo_x) {
    initializeGpio();
  }
  servo_x.servoWrite(calculateServoPulse(x));
}

function setServoY(y) {
  if (!servo_y) {
    initializeGpio();
  }
  servo_y.servoWrite(calculateServoPulse(y));
}

function calculateServoPulse(factor) {
  const multiplier = (config.servo_pulse_max - config.servo_pulse_min) / 2;
  const mid = config.servo_pulse_min + multiplier;
  return mid - factor * multiplier; // minus because i might've mounted it backwards and can't be bothered to fix it... whoops
}

function setShooting(value) {
  console.log("Shooting = " + value);
}
