document.getElementById('fileInput').addEventListener('change', handleFileSelect, false);

let vertices = [];
let faces = [];
let mesh;

function handleFileSelect(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (event) {
        const fileContent = event.target.result;
        const lines = fileContent.split('\n');
        vertices = extractVertices(lines);
        faces = extractFaces(lines);
        faces = faces.map(face => face.map(index => index - 1));
        mesh = new Mesh(vertices, faces);
    };
    reader.readAsText(file);
}

function extractVertices(lines) {
    const vertices = [];

    lines.forEach(line => {
        if (line.startsWith('v ')) {
            const parts = line.split(' ').slice(1);
            const vertex = parts.map(parseFloat);
            vertices.push(vertex);
        }
    });

    return vertices;
}

function extractFaces(lines) {
    const faces = [];

    lines.forEach(line => {
        if (line.startsWith('f ')) {
            const parts = line.split(' ').slice(1);
            const face = parts.map(part => {
                const faceUnit = part.split('/');
                return parseInt(faceUnit[0]);
            })
            faces.push(face);
        }
    });

    return faces;
}

async function readDefaultMesh() {
    const file = 'cube.obj';
    const response = await fetch(file);
    const fileContent = await response.text();
    const lines = fileContent.split('\n');
    vertices = extractVertices(lines);
    faces = extractFaces(lines);
    faces = faces.map(face => face.map(index => index - 1));
    mesh = new Mesh(vertices, faces);
}

readDefaultMesh();