let speechRec = new p5.SpeechRec('en-US', gotSpeech);
let inputText = '';
let outputText1 = '';
let outputText2 = '';
let outputText3 = '';
let img;

let continuous = true;
let interim = false;
speechRec.start(continuous, interim);

let mobileWidth = 300;
let mobileHeight = 535;
let padding = 20;

let messageY = 0;
let speech = new p5.Speech();

let spokenTexts = [];
let lastSpeak = '';

let xSound, vSound;
let checkxSound = true ; 
let checkvSound = true ; 
let phoneImg;

function preload() {
  xSound = loadSound('xSound.mp3');
  vSound = loadSound('vSound.mp3');
  phoneImg = loadImage('mobile.png'); 
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  img = createGraphics(100, 100);
}

function draw() {
  background(220);
  fill(255);
  image(phoneImg, (windowWidth - 1.3*mobileWidth) / 2 , (windowHeight - 1.25*mobileHeight) / 2, 1.3*mobileWidth, 1.25*mobileHeight);
  fill(0);
  textSize(16);
  textAlign(CENTER); 
  fill(0); 
  text("Ask Siri to set a reminder for tomorrow's work call", windowWidth / 2, (windowHeight - mobileHeight) / 2 - 4*padding); 
  textAlign(LEFT); 
  if (inputText !== '') {
    let y = drawText(inputText, (windowWidth - mobileWidth) / 2 + padding, messageY, LEFT, color(0, 0, 255));
    if (outputText1 !== '') {
      y = drawText(outputText1, (windowWidth + mobileWidth) / 2 - padding, y + 50, RIGHT, color(255, 0, 0));
      speakText(outputText1);
    }
    if (outputText2 !== '') {
      y = drawText(outputText2, (windowWidth - mobileWidth) / 2 + padding, y + 50, LEFT, color(0, 25, 255));
    }
    if (outputText3 !== '') {
      y = drawText(outputText3, (windowWidth + mobileWidth) / 2 - padding, y + 50, RIGHT, color(255, 0, 0));
      speakText(outputText3);
    }
  }

  if (messageY < (windowHeight - mobileHeight) / 2 + padding + 50) {
    messageY += 5;
  }

  if (outputText3 === "Reminder set") {
    img.clear();
    img.fill(0, 255, 0);
    img.textSize(70);
    img.textAlign(CENTER, CENTER);
    img.text('V', img.width / 2, img.height / 2);
  }

  image(img, (windowWidth - img.width) / 2, (windowHeight + mobileHeight) / 2 - img.height - padding);
}

function gotSpeech() {
  if (speechRec.resultValue) {
    inputText = 'You: Hey Siri, set a reminder...';
    setTimeout(function () {
      img.background(255, 0, 0);
      img.textSize(70);
      img.textAlign(CENTER, CENTER);
      outputText1 = "Sorry, I didn't catch that. Please try again.";
      img.fill(255);
      img.text('X', img.width / 2, img.height / 2);
      if(checkxSound){
        xSound.play();
        checkxSound = false;
      }
      speechRec.resultString = '';
      setTimeout(function () {
        lastSpeak = speechRec.resultString;
        speechRec.onResult = function() {
          lastSpeech = 'You: ' + speechRec.resultString;
          if (lastSpeech !== '') {
            if (lastSpeech.toLowerCase().includes('e')) {
              outputText2 = "You: Set a reminder for tomorrow's work call";
              setTimeout(function () {
                outputText3 = "Reminder set";
                img.fill(0, 255, 0);
                img.text('V', img.width / 2, img.height / 2);
                if(checkvSound){
                  vSound.play();
                  checkvSound = false;
                }
              }, 3000);
            }
          }
        };
      }, 5000);
    }, 2000);
  }
}

function drawText(txt, x, y, align, col) {
  textAlign(align);
  let words = txt.split(' ');
  let line = '';
  let startY = y;
  let lines = [];
  for (let i = 0; i < words.length; i++) {
    let testLine = line + words[i] + ' ';
    let testWidth = textWidth(testLine);
    if (testWidth > mobileWidth - 2 * padding && i > 0) {
      lines.push(line);
      line = words[i] + ' ';
      y += textAscent() + textDescent();
    } else {
      line = testLine;
    }
  }
  lines.push(line);
  fill(255); 
  let rectWidth = min(textWidth(txt) + padding, mobileWidth - 2 * padding);
  let rectX = align === LEFT ? x - padding / 2 : x - rectWidth + padding / 2;
  rect(rectX, startY - textAscent() - padding / 2, rectWidth, y - startY + textAscent() + textDescent() + padding, 10); 
  fill(col);
  for (let i = 0; i < lines.length; i++) {
    text(lines[i], x, startY + i * (textAscent() + textDescent())); 
  }
  return y;
}



function speakText(txt) {
  if (!txt.startsWith("You:") && !spokenTexts.includes(txt)) {
    speech.speak(txt);
    spokenTexts.push(txt);
  }
}
