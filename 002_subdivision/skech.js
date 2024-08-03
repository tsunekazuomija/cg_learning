
function setup() {
    createCanvas(800, 600, WEBGL);
}

function draw() {
    if (faces === undefined) return;
    if (vertices === undefined) return;
    translate(-100, 0, 0);
    scale(80);
    rotateZ(180);
    faces.forEach(vIdArr => {
        beginShape();
        vIdArr.forEach(vId => {
            const [x, y, z] = vertices[vId - 1];
            vertex(x, y, z);
        });
        endShape(CLOSE);
    });
}