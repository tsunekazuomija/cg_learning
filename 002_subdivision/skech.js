let lastMouseX;
let lastMouseY;
let isDragging = false;

let angle = 0;

function setup() {
    createCanvas(800, 600, WEBGL);
    angleMode(DEGREES);
}

function draw() {
    if (faces === undefined) return;
    if (vertices === undefined) return;
    clear();
    scale(80);

    rotateY(angle * 0.7);
    faces.forEach(vIdArr => {
        beginShape();
        vIdArr.forEach(vId => {
            const [x, y, z] = vertices[vId];
            vertex(x, y, z);
        });
        endShape(CLOSE);
    });

    angle += 1;
}
