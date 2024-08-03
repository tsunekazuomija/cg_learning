document.getElementById('fileInput').addEventListener('change', handleFileSelect, false);

let vertices = [];
let faces = [];

function handleFileSelect(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (event) {
        const fileContent = event.target.result;
        const lines = fileContent.split('\n');
        vertices = extractVertices(lines);
        faces = extractFaces(lines);
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