let model;
let strokePath;

let x, y;
let pen = "down";

//sketch info
let currentColor;
const sketchScale = 0.25;
const size = 50

function setup(){
  createCanvas(800,800);
  background(220);
  frame = 1;
  model = ml5.SketchRNN("cat", modelReady);
  // currentColor = randomColor();
  currentColor = 0;
}

function draw(){
  if (frame >= size){
    background(220);
    frame = 1;
  }
  if (strokePath != null){
    let newX = x + (strokePath.dx * sketchScale);
    let newY = y + (strokePath.dy * sketchScale);
    if (pen == "down"){
      //Draw stroke
      stroke(currentColor);
      strokeWeight(2);

      line(x, y, newX, newY);
    }

    if (pen == "end"){
      model.reset();
      pen = "down";
      strokePath = null;
      frame++;
      x = random(width);
      y = random(height);
      // currentColor = randomColor();
      model.generate(gotSketch)
    } else {
      pen = strokePath.pen;
      strokePath = null;
      //get the next stroke
      x = newX
      y = newY
      model.generate(gotSketch)
    }
  }
}

function randomColor(){
  r = Math.floor(random(255));
  g = Math.floor(random(255));
  b = Math.floor(random(255));
  str = 'rgb(' + r.toString() + ',' + g.toString() + ',' + b.toString() + ')';
  return str;
}

function modelReady(){
  console.log("Model ready");
  model.reset();
  model.generate(gotSketch);
}

function gotSketch(err, s) {
  if(err){
    console.log(err)
  }else{
    strokePath = s;
  }
}
