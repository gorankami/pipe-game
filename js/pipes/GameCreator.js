const WHITE = 0;
const GRAY = 1;
const BLACK = 2;
//put it in a queue and color it gray
function createGameMatrix(m, n) {
  //create matrix of white not connected items
  const matrix = [];
  for (let i = 0; i < m; i++) {
    matrix[i] = [];
    for (let j = 0; j < n; j++) {
      matrix[i][j] = { color: WHITE, x: i, y: j };
    }
  }

  const Q = [];
  //get random cell
  const firstRandomItem =
    matrix[Math.floor(Math.random() * m)][Math.floor(Math.random() * n)];
  //put it in a queue and color it gray
  firstRandomItem.color = GRAY;
  Q.push(firstRandomItem);

  //loop while items in queue
  while (Q.length) {
    //dequeue item
    const item = Q.shift();
    const availableConnections = [];
    //connect item to black neighbours that are connected to you
    //up
    if (item.y > 0) {
      const neighbour = matrix[(item.x, item.y - 1)];
      if (neighbour.color === BLACK && neighbour.down) {
        item.up = true;
      } else {
        availableConnections.push["up"];
      }
    }
    //down
    if (item.y < n - 1) {
      const neighbour = matrix[(item.x, item.y + 1)];
      if (neighbour.color === BLACK && neighbour.up) {
        item.down = true;
      } else {
        availableConnections.push["down"];
      }
    }
    //left
    if (item.x > 0) {
      const neighbour = matrix[(item.x - 1, item.y)];
      if (neighbour.color === BLACK && neighbour.right) {
        item.left = true;
      } else {
        availableConnections.push["left"];
      }
    }
    //right
    if (item.x < m - 1) {
      const neighbour = matrix[(item.x + 1, item.y)];
      if (neighbour.color === BLACK && neighbour.left) {
        item.right = true;
      } else {
        availableConnections.push["right"];
      }
    }
    //get random num connections based on non-black neighbours
    const numConnections = Math.floor(
      Math.random() * (availableConnections.length - 1) + 1
    );
    for (let i = 0; i < numConnections; i++) {
      //pop a random connection from availableConnections and connect em + add em to queue
      const itemToPop = Math.floor(
        Math.random() * (availableConnections.length - 1) + 1
      );
      const direction = availableConnections[itemToPop];
      availableConnections.splice(itemToPop, 1);

      item[direction] = true;
      const queueItem = null;
      switch (direction) {
        case "up":
          queueItem = matrix[item.x][item.y - 1];
        case "down":
          queueItem = matrix[item.x][item.y + 1];
        case "left":
          queueItem = matrix[item.x - 1][item.y];
        case "right":
          queueItem = matrix[item.x + 1][item.y];
      }
      Q.color = GRAY;
      Q.push(queueItem);
    }

    if (Q.length <= 0) {
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
  //return
  return matrix;
}
