//OpenAI variables
let verySecretKeys;
const API_KEY = "";
const url = "https://api.openai.com/v1/chat/completions";
const imageurl = "https://api.openai.com/v1/images/generations";
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

function testImage() {
  console.log("Test Image");
  videoInput.remove();
  noLoop();
  clear();
  displayImage(
    "https://i.pinimg.com/originals/60/1d/00/601d00c9fdd320ae7fe23cd4aa9418f3.png"
  );
}

function draw() {
  background(255);
  image(videoInput, windowWidth / 4, 0, windowWidth / 2, windowHeight / 2);
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

function takePicture() {
  videoInput.remove();
  dropZone.remove();
  cameraButton.remove();
  console.log("Picture Taken");
  let imageURL = videoInput.canvas.toDataURL();
  analyzePicture(imageURL);
  console.log(imageURL);
}

// OPEN AI CODE //

function analyzePicture(pct) {
  //this code is for URL image analysis
  console.log("analyzePicture");
  options.body = JSON.stringify({
    model: "gpt-4-vision-preview",
    messages: [
      {
        role: "user",
        content: [
          { type: "text", text: "What’s in this image?" },
          {
            type: "image_url",
            image_url: pct,
          },
        ],
      },
    ],
    max_tokens: 300,
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
        const prpt = str(response.choices[0].message.content);
        save(prpt + ".", "prompt.txt");
        saveStrings(prpt + ".", "prompt5.txt");
        saveJSON(response.choices[0].message.content, "prompt.json");
        save(response.choices[0].message.content, "prompt2.json", true);
        saveStrings(response.choices[0].message.content, "prompt4.txt");
        //const imageDescription = response.choices[0].message.content;
        const realisticImageDescription =
          "A photography of " + response.choices[0].message.content;
        imageCreation(realisticImageDescription);
      }
    });
}

function imageCreation(imgDesc) {
  console.log("Image Created");
  options.body = JSON.stringify({
    model: "dall-e-3",
    prompt: imgDesc,
    n: 1,
    size: "1024x1024",
    //style: "vivid",
  });

  fetch(imageurl, options) //fetch is JavaScript's built in method for making API calls
    .then((response) => {
      //console.log("response", response);
      const res = response.json();
      return res;
    })
    .then((response) => {
      console.log(response.data[0].url);
      displayImage(response.data[0].url);
    });
}

function displayImage(imgURL) {
  console.log("Image Displayed");
  let img = createImg(imgURL);
  img.size(windowWidth / 2, windowHeight / 2);
  img.position(windowWidth / 4, windowHeight / 2);
}

function mousePressed() {
  saveCanvas();
}
