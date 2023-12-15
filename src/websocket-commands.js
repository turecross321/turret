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
      break;
  }
};

let servo_x;
let servo_y;
function initializeGpio() {
  servo_x = new Gpio(config.pin_servo_x, { mode: Gpio.OUTPUT });
  servo_y = new Gpio(config.pin_servo_y, { mode: Gpio.OUTPUT });
}

function sendMessage(ws, content) {
  ws.send(JSON.parse({ message: content }));
}

function setServoX(x) {
  if (!servo_x) {
    initializeGpio();
  }
  const pulse = calculateServoPulse(
    config.range_servo_x,
    x,
    config.invert_servo_x
  );
  servo_x.servoWrite(pulse);
}

function setServoY(y) {
  if (!servo_y) {
    initializeGpio();
  }
  const pulse = calculateServoPulse(
    config.range_servo_y,
    y,
    config.invert_servo_y
  );
  servo_y.servoWrite(pulse);
}

function calculateServoPulse(range, factor, invert) {
  const pulse_min = 600;
  const pulse_max = 2400;

  const multiplier = (pulse_max - pulse_min) / 2;
  const mid = pulse_min + multiplier;

  let add = factor * multiplier * range;

  if (invert) {
    add = -1 * add;
  }

  const pulse = Math.round(mid + add);
  return pulse;
}

function setShooting(value) {
  console.log("Shooting = " + value);
}
