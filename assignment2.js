let quote = "the net is anarchic and subversive";
let letters = [];
let stepX = 75;
let stepY = 100;
let home, jhinBG, jhinWeapon, yasuoWeapon, yasuoBG;
let yasuoShow = false;
let showImage = false;
let imageTimer;
let keepWords = ['anarchic', 'subversive'];

let showNewQuote = false;
let activeWord = "";
let centeredWord = "";

let newQuotes = {
  anarchic: "with no controlling rules or principles to give order",
  subversive: "\n\nseeking or intended to\nsubvert (undermine the power and authority\nof an established system or institution)"
};
let newQuoteAlpha = 0;

let fonts = ["Georgia", "Courier", "Verdana", "Arial", "Helvetica", "Times"];

function preload() {
  home = loadImage('data/recall.png');
  jhinBG = loadImage('data/jhin/jhin2.png');
  yasuoBG = loadImage('data/yasuo/yasuo_background.jpg');
  jhinWeapon = loadImage('data/jhin/jhin_weapon_new.png');
  yasuoWeapon = loadImage('data/yasuo/yasuo_weapon.png');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  textAlign(CENTER, CENTER);
  imageMode(CENTER);

  let startX = 75;
  let startY = 150;
  let words = quote.split(" ");
  let currentX = startX;
  let currentY = startY;

  // setup array
  for (let word of words) {
    let currentWord = keepWords.includes(word) ? word : "";

    for (let char of word) {
      let x = currentX;
      let y = currentY;
      let size = random(24, 56);
      let col = color(random(255), random(255), random(255));

      let letter = new Letter(char, x, y, size, col, currentWord);
      letters.push(letter);
      currentX += stepX;
    }

    currentX = startX + (words.indexOf(word) + 1) * stepX;
    currentY = startY + (words.indexOf(word) + 1) * stepY;
  }
}

function draw() {
  if (yasuoShow) {
    background(255);
    drawNewBackgroundImage();
  } else {
    background(0);
    drawDefaultBackgroundImage();
  }

  // weapon at the top for toggle
  let weaponX = width / 2;
  let weaponY = jhinWeapon.height * 0.2;
  let currentWeapon = yasuoShow ? yasuoWeapon : jhinWeapon;
  image(currentWeapon, weaponX, weaponY, currentWeapon.width * 0.5, currentWeapon.height * 0.5);

  for (let letter of letters) {
    letter.update();
    letter.show();
  }

  if (showImage) {
    image(home, mouseX, mouseY, 70, 50);
  }

  if (showNewQuote) {
    fill(255);
    textFont('Georgia');
    textSize(24);
    text(newQuotes[activeWord], width / 2, height / 2 + 150);
    newQuoteAlpha = min(newQuoteAlpha + 2, 255);
  }
}

function drawDefaultBackgroundImage() {
  let bgX = width / 8;
  let bgY = height / 1.5;
  let imgWidth = jhinBG.width * 0.5;
  let imgHeight = jhinBG.height * 0.5;
  image(jhinBG, bgX, bgY, imgWidth, imgHeight);
}

function drawNewBackgroundImage() {
  let imgAspect = yasuoBG.width / yasuoBG.height;
  let scaledHeight = height;
  let scaledWidth = height * imgAspect;

  image(yasuoBG, width / 2, height / 2, scaledWidth, scaledHeight);
}

class Letter {
  constructor(char, x, y, size, col, word) {
    this.char = char;
    this.x = x;
    this.y = y;
    this.originalX = x;
    this.originalY = y;
    this.targetX = x;
    this.targetY = y;
    this.size = size;
    this.col = col;
    this.word = word;
    this.exiting = false;
    this.vx = 0;
    this.vy = 0;
  }

  update() {
    if (this.exiting) {
      this.x += this.vx;
      this.y += this.vy;
    } else {
      let dx = this.targetX - this.x;
      let dy = this.targetY - this.y;
      this.x += dx * 0.1;
      this.y += dy * 0.1;
    }
  }

  show() {
    textFont(random(fonts));
    fill(this.col);
    textSize(this.size);
    text(this.char, this.x, this.y);
  }

  flyOut() {
    if (!this.exiting) {
      this.exiting = true;
      let angle = random(TWO_PI);
      let speed = random(5, 10);
      this.vx = cos(angle) * speed;
      this.vy = sin(angle) * speed;
    }
  }

  returnToPosition() {
    this.targetX = this.originalX;
    this.targetY = this.originalY;
    this.exiting = false;
    this.vx = 0;
    this.vy = 0;
  }
}

function mousePressed() {
  let weaponX = width / 2;
  let weaponY = jhinWeapon.height * 0.2;

  if (
    mouseX > weaponX - (jhinWeapon.width * 0.25) &&
    mouseX < weaponX + (jhinWeapon.width * 0.25) &&
    mouseY > weaponY - (jhinWeapon.height * 0.25) &&
    mouseY < weaponY + (jhinWeapon.height * 0.25)
  ) {
    toggleBackground();
  }

  if (centeredWord) return;

  for (let letter of letters) {
    if (
      (letter.word === "anarchic" || letter.word === "subversive") &&
      mouseX > letter.x - textWidth(letter.char) / 2 &&
      mouseX < letter.x + textWidth(letter.char) / 2 &&
      mouseY > letter.y - letter.size / 2 &&
      mouseY < letter.y + letter.size / 2
    ) {
      activeWord = letter.word;
      centeredWord = letter.word;
      arrangeWordToCenter(letter.word);
      flyOutOtherLettersExceptWord(letter.word);
      showNewQuote = true;
      newQuoteAlpha = 0;
      break;
    }
  }
}

function mouseMoved() {
  for (let letter of letters) {
    if (keepWords.includes(letter.word)) continue;
    if (
      !letter.exiting &&
      mouseX > letter.x - textWidth(letter.char) / 2 &&
      mouseX < letter.x + textWidth(letter.char) / 2 &&
      mouseY > letter.y - letter.size / 2 &&
      mouseY < letter.y + letter.size / 2
    ) {
      letter.flyOut();
    }
  }
}

function doubleClicked() {
  for (let letter of letters) {
    letter.returnToPosition();
  }

  showNewQuote = false;
  activeWord = "";
  centeredWord = "";

  showImage = true;
  clearTimeout(imageTimer);
  imageTimer = setTimeout(() => (showImage = false), 500);
}

function toggleBackground() {
  yasuoShow = !yasuoShow;
}

function arrangeWordToCenter(word) {
  let wordLetters = letters.filter((l) => l.word === word);
  let wordWidth = wordLetters.reduce(
    (acc, l) => acc + textWidth(l.char) + 30,
    0
  );

  let startX = (width - wordWidth) / 2;
  let currentX = startX;

  for (let letter of wordLetters) {
    letter.targetX = currentX + textWidth(letter.char) / 2;
    letter.targetY = height / 2;
    currentX += textWidth(letter.char) + 30;
  }
}

function flyOutOtherLettersExceptWord(activeWord) {
  for (let letter of letters) {
    if (letter.word !== activeWord) letter.flyOut();
  }
  centeredWord = "";
}
