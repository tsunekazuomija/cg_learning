
// 4つの頂点の座標と、各頂点の値(true or false)を受け取り、Marching Tetrahedra
// アルゴリズムを適用して、ポリゴン(構成する多角形の座標の配列)を返す

// marching cubeは、union-findを使って、頂点のグループに分け、
// それぞれのグループについてmaxNeibhborとminNeighborからぱたーんを決定
// することで実現できそうな気がする。

function marchingTetrahedra(vertices, values) {
  let includedNum = 0;
  const includedIndices = [];
  for (let i = 0; i < 4; i++) {
    if (values[i]) {
      includedNum++;
      includedIndices.push(i);
    }
  }

  if (includedNum === 0 || includedNum === 4) {
    return [];
  }

  let face = [];

  if (includedNum == 1 || includedNum == 3) {
    let minorIndex = null;
    if (includedNum == 1) {
      minorIndex = includedIndices[0];
    }
    else {
      for (let i = 0; i < 4; i++) {
        if (!values[i]) {
          minorIndex = i;
          break;
        }
      }
    }

    const majorIndices = [0, 1, 2, 3].filter(index => index !== minorIndex);
    face = getFace_1_3([minorIndex], majorIndices, vertices);
  } else {
    const majorIndices = includedIndices;
    const minorIndices = [0, 1, 2, 3].filter(index => !majorIndices.includes(index));
    face = getFace_2_2(minorIndices, majorIndices, vertices);
  }

  return face;
}

function getFace_1_3(group1, group2, vertices) {
  if (group1.length !== 1 || group2.length !== 3) {
    console.log('invalid group');
    console.log(group1);
    console.log(group2);
  }
  const face = [];
  const minorPoint = vertices[group1[0]];
  

  for (let i=0 ; i < 3; i++) {
    const majorPoint = vertices[group2[i]];
    const midPoint = [
      (minorPoint[0] + majorPoint[0]) / 2,
      (minorPoint[1] + majorPoint[1]) / 2,
      (minorPoint[2] + majorPoint[2]) / 2
    ];
    face.push(midPoint);
  }

  return face;
}

function getFace_2_2(group1, group2, vertices) {
  // console.log(group1);
  // console.log(group2);
  const face = [];
  
  let g1Point = vertices[group1[0]];
  for (let j=0; j < 2; j++) {
    const g2Point = vertices[group2[j]];
    const midPoint = [
      (g1Point[0] + g2Point[0]) / 2,
      (g1Point[1] + g2Point[1]) / 2,
      (g1Point[2] + g2Point[2]) / 2
    ];
    face.push(midPoint);
  }

  // console.log(face);

  g1Point = vertices[group1[1]];
  for (let j=1; j >= 0; j--) {
    const g2Point = vertices[group2[j]];
    const midPoint = [
      (g1Point[0] + g2Point[0]) / 2,
      (g1Point[1] + g2Point[1]) / 2,
      (g1Point[2] + g2Point[2]) / 2
    ];
    face.push(midPoint);
  }

  // console.log(face);

  return face;
}


// test
// const vertices = [
//   [0, 0, 0],
//   [1, 0, 0],
//   [0, 1, 0],
//   [0, 0, 1]
// ];

// const values = [true, false, true, false];
// console.log(marchingTetrahedra(vertices, values));