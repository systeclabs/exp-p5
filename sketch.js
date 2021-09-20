// By Roni Kaufman
// https://ronikaufman.github.io/


/*jshint esversion: 6 */

// polygon array and number of verts
let poly = []
//let n = 3 // feel free to play with this number :)

// canvas size variables
let w = 500
let h = 500

// oscillators
let chord = []
let root = 16
let major = [ 2, 4, 8 ]
let minor = [ 1, 3 ,5 ]


const N_FRAMES = 50;
let n = 9;
let r = 200;

function setup() {
  createCanvas(windowWidth, windowHeight);
  stroke(255);
  strokeWeight(3);
  noFill();

  for (let i = 0; i < n; i++) {
    // populate regular polygon vertices given number of points n
  	let a = {
      x: (w/2) + 200*sin(map(i, 0, n-1, 0, TAU)),
      y: (h/2) + 200*cos(map(i, 0, n-1, 0, TAU))
    }
  	poly.push(a)
  }

  //
  for (let i = 0; i < n; i++) {
    // populate regular polygon vertices given number of points n
  	let a = {
      x: (w/2) + 128*sin(map(i, 0, n-1, 0, TAU)),
      y: (h/2) + 128*cos(map(i, 0, n-1, 0, TAU))
    }
  	poly.push(a)
  }
  
  // initialize oscillators
  if (n < 32) {
    for (let i = 0; i < 3; i++)
    	chord[i] = new p5.TriOsc()
  } else {
    for (let i = 0; i < 3; i++)
    	chord[i] = new p5.SinOsc()
  }
  
  // initialize with major chord intervals
  for (let i = 0; i < chord.length; i++) {
    	chord[i].freq(major[i] * root)
        chord[i].amp(0.0)
  		chord[i].stop()
  }
}

function draw() {
  background(0);
  translate(width/2, height/2+r/4);
  
  let xA = r*cos(3*PI/2);
  let yA = r*sin(3*PI/2);
  let xB = r*cos(3*PI/2-TWO_PI/3);
  let yB = r*sin(3*PI/2-TWO_PI/3);
  let xC = r*cos(3*PI/2-2*TWO_PI/3);
  let yC = r*sin(3*PI/2-2*TWO_PI/3);
  
  let xAB = xA/2+xB/2;
  let yAB = yA/2+yB/2;
  let xAC = xA/2+xC/2;
  let yAC = yA/2+yC/2;
  let xBC = xB/2+xC/2;
  let yBC = yB/2+yC/2;
  
  triangle(xA, yA, xB, yB, xC, yC);
  line(xAB, yAB, 0, 0);
  line(xBC, yBC, 0, 0);
  line(xAC, yAC, 0, 0);
  
  let t = (frameCount%N_FRAMES)/N_FRAMES;
  for (let i = 0; i < n; i++) {
    let x = map(i+t, 0, n, 0, xA);
    let y = map(i+t, 0, n, 0, yA);
    line(xAB, yAB, x, y);
    line(x, y, xAC, yAC);
    
    x = map(i+t, 0, n, 0, xB);
    y = map(i+t, 0, n, 0, yB);
    line(xAB, yAB, x, y);
    line(x, y, xBC, yBC);
    
    x = map(i+t, 0, n, 0, xC);
    y = map(i+t, 0, n, 0, yC);
    line(xBC, yBC, x, y);
    line(x, y, xAC, yAC);
  }


   
   // distort oscillatiors
   warpOsc()
}


// helper function implementations ---

function logMap(value, start1, stop1, start2, stop2) {
  // based off of linear regression + existing p5.map function
  
  start2 = log(start2)
  stop2 = log(stop2)
 
  return exp(start2 + (stop2 - start2) * ((value - start1) / (stop1 - start1)))
}

function drawPoly(dx, dy) {
  // draws polygon given vertices in the poly[] array, adds mouse bias using params
  
  let g = 0
  if (mouseIsPressed)
    g = random(-4, 4)
    
  beginShape()
  for (let i = 0; i < n; i++) {
  	let bias = dist(mouseX, mouseY, poly[i].x, poly[i].y)
  	vertex(poly[i].x + dx / logMap(bias, w, 0, dx, 45) + g, poly[i].y + dy / logMap(bias, h, 0, dy, 45) + g)
  }
  endShape()
}

function warpOsc() {
  // uses max dist to determine the frequency distortion
  
  let bias = 0
  for (let i = 0; i < n; i++)
  	bias = max(bias, dist(mouseX, mouseY, poly[i].x, poly[i].y))
  
  for (let i = 0; i < chord.length; i++)
    chord[i].freq(map(bias, w, 0, major[i], minor[i]) * root)
}

function mousePressed() {
  // toggles synths on
  
  for (let i = 0; i < chord.length; i++) {
    chord[i].start()
    chord[i].amp(0.3, 0.5)
  }
}

function mouseReleased() {
  // toggles synths off
  
  for (let i = 0; i < chord.length; i++) {
    chord[i].amp(0.0, 0.5)
    chord[i].stop()
  }
}