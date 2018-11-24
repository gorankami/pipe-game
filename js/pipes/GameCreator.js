const WHITE = 0;
const GRAY = 1;
const BLACK = 2;

function EmptyCell(x, y) {
  return {
    color: WHITE,
    x,
    y
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
  return matrix;
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

function getAvailableConnections(matrix, item) {
  const connections = [];

  const { up, down, left, right } = getNeighbours(matrix, item);
  if (up && up.color === WHITE) {
    connections.push({ direction: "up", neighbour: up });
  }
  if (down && down.color === WHITE) {
    connections.push({ direction: "down", neighbour: down });
  }

  if (left && left.color === WHITE) {
    connections.push({ direction: "left", neighbour: left });
  }
  if (right && right.color === WHITE) {
    connections.push({ direction: "right", neighbour: right });
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

  const start = matrix[random(0, m - 1)][random(0, n - 1)];
  start.color = GRAY;
  Q.push(start);

  while (Q.length) {
    const item = Q.shift();
    item.color = BLACK;
    const availableConnections = getAvailableConnections(matrix, item);
    const connectionsToGenerate = random(0, availableConnections.length);

    //pop a random connection from availableConnections and connect em + add em to queue
    for (let i = 0; i < connectionsToGenerate; i++) {
      const itemToPop = random(0, availableConnections.length - 1);

      const { direction, neighbour } = availableConnections[itemToPop];

      availableConnections.splice(itemToPop, 1);

      item[direction] = neighbour;
      neighbour[oppositeDirection(direction)] = item;
      neighbour.color = GRAY;
      Q.push(neighbour);
    }

    //edge case when queue is empty but there are islands left on the matrix (missed connections)
    if (Q.length === 0) {
      //TODO: THIS PART DOESNT WORK
      //collect all white items that are neighbouring a black cell

      const collection = collectWhitesWithBlackNeighbours(matrix);

      //if non zero items...
      if (collection.length > 0) {
        //get random item from the collection
        const collectionItem = collection[random(0, collection.length - 1)];
        //force one connection on the random neighbouring black item (but not on the selected item itself)
        const neighbourConnection =
          collectionItem.neighbours[
            random(0, collectionItem.neighbours.length - 1)
          ];
        if (neighbourConnection === "up")
          matrix[collectionItem.candidate.x][
            collectionItem.candidate.y - 1
          ].down = true;
        if (neighbourConnection === "down")
          matrix[collectionItem.candidate.x][
            collectionItem.candidate.y + 1
          ].up = true;
        if (neighbourConnection === "left")
          matrix[collectionItem.candidate.x - 1][
            collectionItem.candidate.y
          ].right = true;
        if (neighbourConnection === "right")
          matrix[collectionItem.candidate.x + 1][
            collectionItem.candidate.y
          ].left = true;
        //enqueue item
        Q.push(collectionItem.candidate);
      }
    }
  }

  //convert the matrix to connection nums
  const mat2 = convertMatrix(matrix);
  console.log(matrix);
  console.log(mat2);
  return mat2;
}

function convertMatrix(matrix) {
  const result = [];
  for (let array of matrix) {
    const row = [];
    for (let i in array) {
      let count = 0;
      if (!!array[i].up) count++;
      if (!!array[i].down) count++;
      if (!!array[i].left) count++;
      if (!!array[i].right) count++;
      let cellType = count;
      if (count === 0) cellType = 5;
      if (count === 1) cellType = 0; //one connection, its type 0
      if (count === 2) {
        //two connections, can be two oposite connections or two close connections
        //To find if its type of two closest connections we are going clockwise and two connections one after the other should sum to 3,
        //if valued up = 1; right = 2; down = 1; left = 2;. Check combinations on paper and you'll see
        if (
          (!!array[i].up && 1) +
            (!!array[i].right && 2) +
            (!!array[i].down && 1) +
            (!!array[i].left && 2) ===
          3
        ) {
          cellType = 1; //two close connections
        }
        //otherwise, its of type 2, two oposite connections. Its already set on initialization
      }
      //..that means for type 3 (three connections) and type 4 (four connections), set on initialization already
      row.push(cellType);
    }
    result.push(row);
  }
  return result;
}

function collectWhitesWithBlackNeighbours(matrix) {
  const collection = [];
  //loop arrays in matrix
  for (let array of matrix) {
    //loop items in array
    for (let candidate of array) {
      //if white and if on of neighbours is black
      if (candidate.color === WHITE) {
        const neighbours = [];

        if (
          candidate.x > 0 &&
          matrix[candidate.x - 1][candidate.y].color === BLACK
        )
          neighbours.push("left");
        if (
          candidate.x < m - 1 &&
          matrix[candidate.x + 1][candidate.y].color === BLACK
        )
          neighbours.push("right");

        if (
          candidate.y > 0 &&
          matrix[candidate.x][candidate.y - 1].color === BLACK
        )
          neighbours.push("up");

        if (
          candidate.y < n - 1 &&
          matrix[candidate.x][candidate.y + 1].color === BLACK
        )
          neighbours.push("down");

        if (neighbours.length) {
          collection.push({
            candidate,
            neighbours
          });
        }
      }
    }
  }
  return collection;
}
