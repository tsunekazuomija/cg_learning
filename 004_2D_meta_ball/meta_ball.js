
function marchingSquare(vertices, values, center) {
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

  if (includedNum === 1) {
    return getLine_1(includedIndices[0], vertices);
  }

  if (includedNum === 3) {
    let minorIndex = [0, 1, 2, 3].filter(index => !includedIndices.includes(index))[0];
    return getLine_1(minorIndex, vertices);
  }

  return getLine_2(includedIndices, vertices, center);
}



function getLine_1(index, vertices) {
  return [
    [getMidPoint(vertices[index], vertices[(index + 1) % 4]),
    getMidPoint(vertices[index], vertices[(index + 3) % 4])]
  ];
}

function getLine_2(indices, vertices, center) {
  // includedな点が隣り合うか
  if ((indices[0] + 1) % 4 === indices[1] || (indices[1] + 1) % 4 === indices[0]) {
    if ((indices[0] + 1) % 4 === indices[1]) {
      return [
        [
          getMidPoint(vertices[indices[0]], vertices[(indices[0] + 3) % 4]),
          getMidPoint(vertices[indices[1]], vertices[(indices[1] + 1) % 4])
        ]
      ];
    } else {
      return [
        [
          getMidPoint(vertices[indices[0]], vertices[(indices[0] + 1) % 4]),
          getMidPoint(vertices[indices[1]], vertices[(indices[1] + 3) % 4])
        ]
      ];
    }
  }

  // includedな点が対角にある場合
  if (center) {
    return [
      [
        getMidPoint(vertices[indices[0]], vertices[(indices[0] + 1) % 4]),
        getMidPoint(vertices[(indices[0] + 1) % 4], vertices[indices[1]])
      ],
      [
        getMidPoint(vertices[indices[1]], vertices[(indices[1] + 1) % 4]),
        getMidPoint(vertices[(indices[1] + 1) % 4], vertices[indices[0]])
      ]
    ]
  }
  else {
    return [
      [
        getMidPoint(vertices[indices[0]], vertices[(indices[0] + 3) % 4]),
        getMidPoint(vertices[indices[0]], vertices[(indices[0] + 1) % 4])
      ],
      [
        getMidPoint(vertices[indices[1]], vertices[(indices[1] + 3) % 4]),
        getMidPoint(vertices[indices[1]], vertices[(indices[1] + 1) % 4])
      ]
    ]
  }
}



function getMidPoint(p1, p2) {
  return [
    (p1[0] + p2[0]) / 2,
    (p1[1] + p2[1]) / 2
  ];
}
