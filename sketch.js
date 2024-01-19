//OpenAI variables
let verySecretKeys;
const API_KEY = ;
const url = "https://api.openai.com/v1/chat/completions";
let options = {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${API_KEY}`,
  },
};

//camera variables
let videoInput;
let cameraButton;

//drag and drop variables
let dropZone;

function setup() {
  //general canvas
  createCanvas(windowWidth, windowHeight);
  background(255);

  //drag and drop
  dropZone = createDiv("Drop Image Here");
  dropZone.style("font-size", "30px");
  dropZone.style("color", "white");
  dropZone.style("background-color", "red");
  dropZone.style("width", "600px");
  dropZone.style("height", "200px");
  dropZone.style("text-align", "center");
  dropZone.style("line-height", "200px");
  dropZone.position(windowWidth / 2 - 300, windowHeight / 2 + 125);
  dropZone.dragOver(highlight);
  dropZone.dragLeave(unhighlight);
  dropZone.drop(gotFile, unhighlight);

  //video input
  videoInput = createCapture(VIDEO);
  videoInput.size(windowWidth / 2, windowHeight / 2);
  videoInput.hide();

  //camera button
  cameraButton = createButton("Take Picture");
  cameraButton.style("font-size", "30px");
  cameraButton.style("color", "white");
  cameraButton.style("background-color", "red");
  cameraButton.position(windowWidth / 2 - 90, windowHeight / 2 + 50);
  cameraButton.mousePressed(takePicture);
}

function draw() {
  image(videoInput, windowWidth / 4, 0, windowWidth / 2, windowHeight / 2);
}

function takePicture() {
  console.log("Picture Taken");
  let imageURL = videoInput.canvas.toDataURL();
  console.log(imageURL);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function highlight() {
  dropZone.style("background-color", "green");
}

function unhighlight() {
  dropZone.style("background-color", "red");
}
function gotFile(file) {
  console.log(file);
}

// OPEN AI CODE //

function analyzePicture() {

  options.body = JSON.stringify({
    model: "gpt-4-vision-preview",
    messages: [
      {
        role: "user",
        content: [
          { type: "text", text: "What’s in this image?" },
          {
            type: "image_url",
            image_url:
              "https://upload.wikimedia.org/wikipedia/commons/thumb/d/dd/Gfp-wisconsin-madison-the-nature-boardwalk.jpg/2560px-Gfp-wisconsin-madison-the-nature-boardwalk.jpg",
          },
        ],
      },
    ],
  });

  fetch(url, options) //fetch is JavaScript's built in method for making API calls
    .then((response) => {
      //console.log("response", response);
      const res = response.json();
      return res;
    })
    .then((response) => {
      console.log(response);
      if (response.choices && response.choices[0]) {
        console.log(response.choices[0].message.content + ".");
      }
    });
}