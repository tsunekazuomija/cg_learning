document.getElementById('subdivideButton').addEventListener('click', subdivide, false);

function subdivide() {
    console.log('subdivide');
    mesh.catmullClarkSubdivision();
    vertices = mesh.getVertices();
    faces = mesh.getFaces();
    console.log(vertices);
    console.log(faces);
}
