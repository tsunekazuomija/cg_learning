const L = 10; // x, y, z方向
const step = 1;

function setup() {
  createCanvas(800, 600, WEBGL);
  angleMode(DEGREES);

  init();
}

const verticesSet = [
  [0, 1, 3, 5],
  [1, 2, 3, 5],
  [0, 3, 4, 5],
  [2, 3, 5, 6],
  [3, 4, 5, 7],
  [3, 5, 6, 7]
];

function init() {
  clear();
  scale(20);
  // rotateY(45);
  rotateX(45);

  for (let x = 0; x < L; x += step) {
    for (let y = 0; y < L; y += step) {
      for (let z = 0; z < L; z += step) {
        let points = [
          [x, y, z],
          [x + step, y, z],
          [x + step, y + step, z],
          [x, y + step, z],
          [x, y, z + step],
          [x + step, y, z + step],
          [x + step, y + step, z + step],
          [x, y + step, z + step]
        ];

        let valueSet = points.map(point => pointInSphere(point));

        
        let rotatedVerticesSet = rotateVerticesSet(x, y, z);
        if (z === 0){
          console.log(x, y, z);
          console.log(rotatedVerticesSet);
        }
        

        for (let i = 0; i < rotatedVerticesSet.length; i++) {
          const vertices = rotatedVerticesSet[i].map(index => points[index]);
          const values = rotatedVerticesSet[i].map(index => valueSet[index]);
          const face = marchingTetrahedra(vertices, values);
          if (face.length) {
            beginShape();
            face.forEach(point => {
              vertex(point[0], point[1], point[2]);
            });
            endShape(CLOSE);
          }
        }

      }
    }
  }
}

// function rotateVerticesSet(n) {
//   // let num = n % 4;
//   // let rotated = verticesSet.map(vertices => {
//   //   return vertices.map(index => {
//   //     if (index < 4) {
//   //       return (index + num) % 4;
//   //     }
//   //     return (index + num) % 4 + 4;
//   //   });
//   // })
//   // return rotated;
//   let num = n % 2;
//   if (num === 0) {
//     return verticesSet;
//   }
//   let rotated = verticesSet.map(vertices => {

//   })
// }

function rotateVerticesSet(x, y, z) {
  let rotated = verticesSet
  if (x % 2 !== 0) {
    rotated = rotated.map(vertices => {
      return vertices.map(index => {
        switch (index) {
        case 0:
          return 1;
        case 1:
          return 0;
        case 2:
          return 3;
        case 3:
          return 2;
        case 4:
          return 5;
        case 5:
          return 4;
        case 6:
          return 7;
        case 7:
          return 6;
        }
      })
    })
  }

  if (y % 2 !== 0) {
    rotated = rotated.map(vertices => {
      return vertices.map(index => {
        switch (index) {
        case 0:
          return 3;
        case 1:
          return 2;
        case 2:
          return 1;
        case 3:
          return 0;
        case 4:
          return 7;
        case 5:
          return 6;
        case 6:
          return 5;
        case 7:
          return 4;
        }
      });
    });
  }

  if (z % 2 !== 0) {
    rotated = rotated.map(vertices => {
      return vertices.map(index => {
        switch (index) {
        case 0:
          return 4;
        case 1:
          return 5;
        case 2:
          return 6;
        case 3:
          return 7;
        case 4:
          return 0;
        case 5:
          return 1;
        case 6:
          return 2;
        case 7:
          return 3;
        }
      });
    });
  }

  return rotated;
}

const center = [L / 2, L / 2, L / 2];
const radius = L / 4;

function pointInSphere(point) {
  const [x, y, z] = point;
  return (x - center[0]) ** 2 + (y - center[1]) ** 2 + (z - center[2]) ** 2 < radius ** 2;
}

function pointInCube(point) {
  const [x, y, z] = point;
  return L/3 <= x && x <= L*2/3 && L/3 <= y && y <= L*2/3 && 0 <= z && z <= 0;
}