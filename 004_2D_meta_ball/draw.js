const step = 5;

function setup() {
  console.log("setup");
  createCanvas(800, 600);

}

function draw() {
  clear();
  // translate(400, 400);
  for (let x = 0; x < 800; x += step) {
    for (let y = 0; y < 800; y += step) {

      const vertices = [
        [x, y],
        [x + step, y],
        [x + step, y + step],
        [x, y + step]
      ];
      const values = vertices.map(point => pointInMetaBall(point[0], point[1], 1));
      const center = pointInCircle(x + step / 2, y + step / 2);
      const lines = marchingSquare(vertices, values, center);
      // console.log(lines);
      lines.forEach(l => {
        line(l[0][0], l[0][1], l[1][0], l[1][1]);
      });
    }
  }
}

function pointInCircle(x, y) {
  return (x-400)*(x-400)+ (y-400)*(y-400) < 200*200;
}

let cnt = 0;
function pointInMetaBall(x, y, threshold) {
  const x0 = 400;
  const y0 = 300;
  const x1 = mouseX;
  const y1 = mouseY;

  let val = 5000 / ((x - x0) * (x - x0) + (y - y0) * (y - y0));
  val += 5000 / ((x - x1) * (x - x1) + (y - y1) * (y - y1));

  return val > threshold;
}