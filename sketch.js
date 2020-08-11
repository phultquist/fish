let images = [],
  archan,
  archanog;
let fish = [],
  archanfish;
let sinceHighlight = 0;
let d = 50;
let big = 150;

function preload() {
  for (i = 0; i < 32; i++) {
    for (n = 0; n < 2; n++) {
      // num fish per person
      images.push(loadImage("assets/" + i + ".png"));
      images.push(loadImage("assets/" + i + ".png"));
    }
  }
  archanog = loadImage("assets/archan.png");
  archan = archanog;
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  // images.forEach(im => im.mask(shape))
  fish = images.map((im, i) => {
    return new Fish(im, false, i);
  });

  archanfish = new Fish(archan, true);
  fish.push(archanfish);
  // mask.clear();
  // mask.noStroke();
  angleMode(DEGREES);
}

function draw() {
  background(0);
  fish.forEach((f) => {
    f.update();
    f.draw();
  });
}

class Fish {
  constructor(img, archan, i) {
    this.i = i;
    this.size = random(d - 20, d);
    this.img = img;
    this.archan = archan;
    this.highlighted = false;
    this.init();
    this.bspeed = random(-0.5, -2);
  }

  init() {
    this.x = random(0, width);
    this.startY = random(0, height - this.size);
    if (this.archan) {
      this.startY = height * 0.4;
    }
    this.slope = random(-0.1, 0.1);
    this.offset = 0;
    this.xoff = random(0, width);
    this.speed = random(1, 3);
    this.frazzled = false;
    this.delay = random(0, 150);
    this.img.mask(getShape(this.size));
  }

  draw() {
    push();


    if (this.archan) {
      this.size;
    } else {
      imageMode(CORNER);
    }
    stroke(255);
    noFill();
    // line(this.x + this.size/2, this.y, this.x + this.size/2 + 50, this.y + this.size)
    let offset = -50;
    if (this.highlighted) {
      offset = (-150 / 120) * this.size;
    }
    if (this.speed < 0) {
      offset *= -1;
    }
    if (this.frazzled && sinceHighlight > 100 + this.delay) {
      rotate(random(-0.1,0.1));
      translate(random(0,1), random(0,1))
    }
    image(this.img, this.x, this.y, this.size, this.size);
    beginShape();
    vertex(this.x + this.size / 2 + offset, this.y + this.size);
    vertex(this.x + this.size / 2 + offset, this.y + this.size);
    curveVertex(this.x + this.size / 2, this.y);
    curveVertex(
      this.x + (this.speed < 0 ? 0 : this.size),
      this.y + this.size / 2
    );
    curveVertex(this.x + this.size / 2, this.y + this.size);
    vertex(this.x + this.size / 2 + offset, this.y);
    vertex(this.x + this.size / 2 + offset, this.y);
    endShape();


    pop();
  }

  update() {
    if (this.highlighted) {
      sinceHighlight++;
      let size = map(sinceHighlight, 0, 20, d, big);
      if (size > big) {
        size = big;
      }
      this.size = size;
    }

    if (!this.frazzled && sinceHighlight > 100 + this.delay && !this.archan) {
      this.frazzle();
    }

    if (this.frazzled && sinceHighlight > 100 + this.delay) {
      //   rotate(100)
    }

    if (this.frazzled && sinceHighlight > 250 + this.delay && !this.archan) {
      this.speed = this.bspeed;
      this.frazzled = false;
    }

    this.x += this.speed;
    if (this.x > width && this.speed > 0) {
      this.reset(false);
    } else if (this.x < -1 * this.size) {
      this.reset(true);
    }
    if (this.y > height + this.size || this.y < -1 * this.size) {
      this.reset(false);
    }
    let sinInput = map(this.x - this.xoff, 0, width / 2, 0, 360); //cycles per turn controlled by n* width
    this.offset += this.slope;
    this.y = 50 * sin(sinInput) + this.startY + this.offset;
    if (this.i == 1) {
      // console.log(sinInput);
      // console.log(this.y);
    }
  }

  frazzle() {
    this.speed = 0;
    this.slope = 0;
    this.frazzled = true;
    // this.update = this.frazzleUpdate;
  }

  reset(archan) {
    this.offset = 0;
    this.slope = random(-1, 1);
    if (!archan) {
      this.x = -1 * this.size;
      this.speed = random(1, 3);
      // this.speed = 10
    } else {
      this.x = width;
      this.speed = this.archan ? -2 : this.bspeed;
      this.slope = 0;
    }
  }

  highlight() {
    this.size = 200;
    // this.init()
    this.speed = -2;
    // this.slope = 0;
    this.highlighted = true;
    // noLoop();
  }
}

function getShape(size) {
  let shape = createGraphics(size, size);
  shape.background(255, 0, 0);
  shape.fill(255);
  shape.noStroke();
  shape.clear();
  shape.circle(size / 2, size / 2, size - 5);
  return shape;
}

function keyPressed() {
  console.log(keyCode == 32);
  if (keyCode == 32) archanfish.highlight();
}
