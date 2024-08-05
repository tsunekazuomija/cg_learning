class Mesh {
  constructor(vertices, faces) {
    this.vertices = vertices;
    this.faces = faces;
  }

  getVertices() {
    return this.vertices;
  }

  getFaces() {
    return this.faces;
  }

  catmullClarkSubdivision() {
    const newVertices = [];
    const facePoints = [];
    const edgePoints = new Map();
    const midPoints = new Map();
    const vertexPoints = new Map();

    // 1. Compute face points
    for (let i=0; i < this.faces.length; i++) {
      const face = this.faces[i];
      const facePoint = [0, 0, 0];
      for (let j=0; j < face.length; j++) {
        const vertex = this.vertices[face[j]];
        facePoint[0] += vertex[0];
        facePoint[1] += vertex[1];
        facePoint[2] += vertex[2];
      }
      facePoint[0] /= face.length;
      facePoint[1] /= face.length;
      facePoint[2] /= face.length;
      facePoints.push(facePoint);
      newVertices.push(facePoint);
    }

    // 2. Compute edge points
    const edges = new Map(); // key: edgeKey, value: faceIndices
    for (let i=0; i < this.faces.length; i++) {
      const face = this.faces[i];
      for (let j=0; j < face.length; j++) {
        const v1 = face[j];
        const v2 = face[(j+1) % face.length];

        const edgeKey = `${Math.min(v1, v2)}_${Math.max(v1, v2)}`;

        if (!edges.has(edgeKey)) {
          edges.set(edgeKey, []);
        }
        edges.get(edgeKey).push(i);
      }
    }

    for (let [edgeKey, faceIndices] of edges.entries()) {
      const [v1, v2] = edgeKey.split('_').map(Number);
      const edgePoint = [0, 0, 0];
      const midPoint = [
        (this.vertices[v1][0] + this.vertices[v2][0]),
        (this.vertices[v1][1] + this.vertices[v2][1]),
        (this.vertices[v1][2] + this.vertices[v2][2])
      ];
      edgePoint[0] += midPoint[0];
      edgePoint[1] += midPoint[1];
      edgePoint[2] += midPoint[2];

      for (let faceIndex of faceIndices) {
        edgePoint[0] += facePoints[faceIndex][0];
        edgePoint[1] += facePoints[faceIndex][1];
        edgePoint[2] += facePoints[faceIndex][2];
      }

      edgePoint[0] /= (2 + faceIndices.length);
      edgePoint[1] /= (2 + faceIndices.length);
      edgePoint[2] /= (2 + faceIndices.length);

      edgePoints.set(edgeKey, newVertices.length);
      midPoints.set(edgeKey, midPoint.map(x => x/2));
      newVertices.push(edgePoint);
    }

    // 3. Compute vertex points
    const vertexFaceAdjacency = new Map(); // key: vertexIndex, value: faceIndices
    for (let faceIndex in this.faces) {
      const face = this.faces[faceIndex];
      for (let vertexIndex of face) {
        if (!vertexFaceAdjacency.has(vertexIndex)) {
          vertexFaceAdjacency.set(vertexIndex, []);
        }
        vertexFaceAdjacency.get(vertexIndex).push(faceIndex);
      }
    }

    for (let vertexIndex in this.vertices) {
      const adjacentFaces = vertexFaceAdjacency.get(Number(vertexIndex));
      const n = adjacentFaces.length;
      const F = [0, 0, 0]; // 頂点が含まれる面の重心の平均
      const R = [0, 0, 0]; // 頂点が含まれる辺の中点の平均

      for (let faceIndex of adjacentFaces) {
        F[0] += facePoints[faceIndex][0];
        F[1] += facePoints[faceIndex][1];
        F[2] += facePoints[faceIndex][2];
      }
      F[0] /= n;
      F[1] /= n;
      F[2] /= n;

      const adjacentEdges = [];
      for (let faceIndex of adjacentFaces) {
        const face = this.faces[faceIndex];
        for (let i=0; i < face.length; i++) {
          const v1 = face[i];
          const v2 = face[(i+1) % face.length];
          if ((v1 == vertexIndex) || (v2 == vertexIndex)) {
            const edgeKey = `${Math.min(v1, v2)}_${Math.max(v1, v2)}`;
            adjacentEdges.push(midPoints.get(edgeKey)); 
          }
        }
      }

      for (let edgePoint of adjacentEdges) {
        R[0] += edgePoint[0];
        R[1] += edgePoint[1];
        R[2] += edgePoint[2];
      }
      R[0] /= adjacentEdges.length;
      R[1] /= adjacentEdges.length;
      R[2] /= adjacentEdges.length;

      const originalVertex = this.vertices[vertexIndex];
      const newVertex = [
        (F[0] + 2*R[0] + (n-3)*originalVertex[0]) / n,
        (F[1] + 2*R[1] + (n-3)*originalVertex[1]) / n,
        (F[2] + 2*R[2] + (n-3)*originalVertex[2]) / n
      ];

      vertexPoints.set(vertexIndex, newVertices.length);
      newVertices.push(newVertex);
    }

    // 4. generate new faces
    const newFaces = [];
    for (let faceIndex in this.faces) {
      const face = this.faces[faceIndex];
      const facePointIndex = Number(faceIndex);

      for (let i=0; i < face.length; i++) {
        const v_prev = face[(i+face.length-1) % face.length];
        const v = face[i]; // 考えている面のi番目の頂点のindex
        const v_next = face[(i+1) % face.length]; // 考えている面のi+1番目の頂点のindex
        const edgeKey1 = `${Math.min(v_prev, v)}_${Math.max(v_prev, v)}`;
        const edgeKey2 = `${Math.min(v, v_next)}_${Math.max(v, v_next)}`;
        const newFace = [
          vertexPoints.get(String(v)),
          edgePoints.get(edgeKey1),
          facePointIndex,
          edgePoints.get(edgeKey2)
        ];
        newFaces.push(newFace);
      }
    }
    console.log(vertexPoints)

    this.vertices = newVertices;
    this.faces = newFaces;
  }
}