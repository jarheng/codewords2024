let quote = "the net is anarchic and subversive";

// for letter manipulation
let letters = [];
let gravity = 2;
let floatingSpeed = 10;
let returnSpeed = 5;

// for word starting position
let stepX = 40;
let stepY = 10;

let img;
// for image toggle
let showImage = false;

function preload() {
  img = loadImage('data/Bang.png');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  textAlign(CENTER, CENTER);
  
  // start words like a step
  let startX = 50;
  let startY = 50;
  
  for (let i = 0; i < quote.length; i++) {
    let x = startX + stepX * i;
    let y = startY + stepY * i;
    let size = random(24, 56);
    let col = color(random(255), random(255), random(255));
    let letter = new Letter(quote.charAt(i), x, y, size, col);
    letters.push(letter);
  }
}

function draw() {
  background(255);
  
  // for letter manipulation
  for (let i = 0; i < letters.length; i++) {
    letters[i].update();
    letters[i].show();
  }

  // for image when click
  if (showImage) {
    imageMode(CENTER);
    image(img, mouseX, mouseY, 100, 100);
  }
}

class Letter {
  constructor(char, x, y, size, col) {
    this.char = char;
    this.x = x;
    this.y = y;
    // velocity
    this.vx = 0;
    this.vy = 0;
    // flag for moving letter
    this.falling = false;
    // default position
    this.defaultX = x;
    this.defaultY = y;
    // flag to return letters to default pos
    this.returning = false;
    this.size = size;
    this.col = col;
  }
  
  // update letter
  update() {
    if (this.falling) {
      this.vx = random(-floatingSpeed, floatingSpeed);
      this.vy = random(-floatingSpeed, floatingSpeed);
      this.x += this.vx;
      this.y += this.vy;
    }
    
    // moving back to default pos
    if (this.returning) {
      let dx = this.defaultX - this.x;
      let dy = this.defaultY - this.y;
      
      // move the letter toward the default pos
      this.x += dx * 0.1;
      this.y += dy * 0.1;
      
      // stop returning when it's at default pos
      if (abs(dx) < 1 && abs(dy) < 1) {
        this.x = this.defaultX;
        this.y = this.defaultY;
        this.returning = false;
      }
    }
    
    // check if the mouse is over the letter
    if (!this.returning && mouseX > this.x - textWidth(this.char) / 2 && mouseX < this.x + textWidth(this.char) / 2 && mouseY > this.y - 20 && mouseY < this.y + 20) {
      this.falling = true;
    }
  }
  
  // display the letter
  show() {
    fill(this.col);
    textSize(this.size);
    text(this.char, this.x, this.y);
  }
  
  // trigger letter to return smoothly to its default pos
  returnToPosition() {
    this.falling = false; // stop floating
    this.returning = true; //returning to pos
  }
}

// when clicked, make letters fly back to their original pos and show image
function mousePressed() {
  for (let i = 0; i < letters.length; i++) {
    letters[i].returnToPosition();
  }
  
  // show the image when clicked
  showImage = true;

  // hide the image after a short time
  setTimeout(() => {
    showImage = false;
  }, 500);
}
