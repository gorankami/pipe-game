const WHITE = 0;
const GRAY = 1;
const BLACK = 2;

function EmptyCell(x, y) {
  return {
    color: WHITE,
    x,
    y,
    up: false,
    down: false,
    left: false,
    right: false
  };
}

function EmptyMatrix(m, n) {
  const matrix = [];
  for (let i = 0; i < m; i++) {
    matrix[i] = [];
    for (let j = 0; j < n; j++) {
      matrix[i][j] = EmptyCell(i, j);
    }
  }
}

function getNeighbours(matrix, item) {
  let x = item.x,
    y = item.y;
  return {
    up: y > 0 ? matrix[x][y - 1] : undefined,
    down: y < matrix[0].length - 1 ? matrix[x][y + 1] : undefined,
    left: x > 0 ? matrix[x - 1][y] : undefined,
    right: x < matrix.length - 1 ? matrix[x + 1][y] : undefined
  };
}

function random(max) {
  return Math.floor(Math.random * max);
}

function getAvailableConnections(matrix, item) {
  const connections = [];

  const { up, down, left, right } = getNeighbours(matrix, item);
  if (up && up.color === WHITE) {
    connections.push[{ direction: "up", neighbour: up }];
  }
  if (down && down.color === WHITE) {
    connections.push[{ direction: "down", neighbour: down }];
  }

  if (left && left.color === WHITE) {
    connections.push[{ direction: "left", neighbour: left }];
  }
  if (right && right.color === WHITE) {
    connections.push[{ direction: "right", neighbour: right }];
  }
  return connections;
}

function oppositeDirection(direction) {
  switch (direction) {
    case "up":
      return "down";
    case "down":
      return "up";
    case "left":
      return "right";
    case "right":
      return "left";
  }
}

function createGameMatrix(m, n) {
  const matrix = EmptyMatrix(m, n);

  const Q = [];

  const start = matrix[random(m)][random(n)];
  start.color = GRAY;
  Q.push(start);

  while (Q.length) {
    const item = Q.shift();
    const availableConnections = getAvailableConnections(matrix, item);
    const connectionsToGenerate = random(availableConnections.length - 1) + 1;

    //pop a random connection from availableConnections and connect em + add em to queue
    for (let i = 0; i < connectionsToGenerate; i++) {
      const itemToPop = random(availableConnections.length - 1) + 1;
      const { direction, neighbour } = availableConnections[itemToPop];

      availableConnections.splice(itemToPop, 1);

      item[direction] = neighbour;
      neighbour[oppositeDirection(direction)] = item;
      const queueItem = neighbour;
      queueItem.color = GRAY;
      Q.push(queueItem);
    }

    //edge case when queue is empty but there are islands left on the matrix (missed connections)
    if (Q.length < 0) {
      //collect all white items that are neighbouring a black cell
      const collection = [];
      //loop arrays in matrix
      for (let array of matrix) {
        //loop items in array
        for (let candidate of array) {
          //if white and if on of neighbours is black
          if (candidate.color === WHITE) {
            const checkLeft =
              candidate.x > 0 &&
              matrix[candidate.x - 1][candidate.y].color === BLACK;
            const checkRight =
              candidate.x < m - 1 &&
              matrix[candidate.x + 1][candidate.y].color === BLACK;

            const checkUp =
              candidate.y > 0 &&
              matrix[candidate.x][candidate.y - 1].color === BLACK;
            const checkDown =
              candidate.y < n - 1 &&
              matrix[candidate.x][candidate.y + 1].color === BLACK;
            if (checkLeft || checkRight || checkUp || checkDown) {
              //insert in collection
              colectionItem = {
                candidate,
                neighbours: []
              };
              collection.push(collectionItem);
              if (checkLeft) collectionItem.neighbours.push("left");
              if (checkRight) collectionItem.neighbours.push("right");
              if (checkUp) collectionItem.neighbours.push("up");
              if (checkDown) collectionItem.neighbours.push("down");
            }
          }
        }
      }
      //if non zero items...
      if (collection.length > 0) {
        //get random item from the collection
        const collectionItem = Math.floor(Math.random() * collection.length);
        //force one connection on the random neighbouring black item (but not on the selected item itself)
        const neighborConnection = Math.floor(
          Math.random() * collectionItem.neighbours.length
        );
        if (neighborConnection === "up")
          matrix[collectionItem.candidate.x][
            collectionItem.candidate.y - 1
          ].down = true;
        if (neighborConnection === "down")
          matrix[collectionItem.candidate.x][
            collectionItem.candidate.y - 1
          ].up = true;
        if (neighborConnection === "left")
          matrix[collectionItem.candidate.x][
            collectionItem.candidate.y - 1
          ].right = true;
        if (neighborConnection === "right")
          matrix[collectionItem.candidate.x][
            collectionItem.candidate.y - 1
          ].left = true;
        //enqueue item
        Q.push(collectionItem.candidate);
      }
    }
  }

  //convert the matrix to connection nums
  const mat2 = convertMatrix(matrix);
  //return
  return mat2;
}

function convertMatrix(matrix) {
  for (let array of matrix) {
    for (let i in array) {
      let count = 0;
      if (array[i].up) count++;
      if (array[i].down) count++;
      if (array[i].left) count++;
      if (array[i].right) count++;
      array[i] = count;
    }
  }
}
