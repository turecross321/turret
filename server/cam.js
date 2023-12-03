const cv = require("opencv4nodejs");

// Create a video capture object for the default camera (index 0)
const cap = new cv.VideoCapture(0);

// Create a window to display the video stream
const namedWindow = new cv.NamedWindow("Webcam", 0);

// Start capturing frames and display them in the window
setInterval(() => {
  const frame = cap.read();
  namedWindow.imshow(frame);
}, 1000 / 30); // Adjust the interval for your desired frame rate
