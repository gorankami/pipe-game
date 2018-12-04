/*
 * Engine that contains all the logic of a pipes game
 * @author Goran Antic
 */
import {
  random
} from "./../Common"
import {
  createGameMatrix
} from "./GameCreator";

export const cellTypes = [
  ["up"],
  ["up", "right"],
  ["up", "down"],
  ["up", "down", "right"],
  ["up", "down", "left", "right"],
  []
];

export default class Engine {




  constructor(rows, columns) {
    this.rows = rows;
    this.columns = columns;
    this.map = [];
    this.startCell = {
      i: 0,
      j: 0
    };
    this.direction = {
      any: 0,
      left: 1,
      right: 2,
      up: 3,
      down: 4
    };
  };

  initMap(randomize) {
    this.map = [];
    for (let i = 0; i < this.rows; i++) {
      this.map[i] = [];
      for (let j = 0; j < this.columns; j++) {
        this.map[i][j] = randomize ?
          this.createRandomCell() :
          this.createEmptyCell();
      }
    }
  }

  createEmptyCell(connected) {
    return {
      up: false,
      down: false,
      left: false,
      right: false,
      connected: !!connected,
      locked: false
    };
  }

  //needed this on initial engine testing
  createRandomCell(connected) {
    return {
      up: !!random(0, 1),
      down: !!random(0, 1),
      left: !!random(0, 1),
      right: !!random(0, 1),
      connected: !!connected,
      locked: false
    };
  }

  rotateCellCCW(i, j) {
    let cell = this.map[i][j];
    let temp = cell.left;
    cell.left = cell.up;
    cell.up = cell.right;
    cell.right = cell.down;
    cell.down = temp;
  }

  rotateCellCW(i, j) {
    let cell = this.map[i][j];
    let temp = cell.left;
    cell.left = cell.down;
    cell.down = cell.right;
    cell.right = cell.up;
    cell.up = temp;
  }

  resetConnections() {
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.columns; j++) {
        this.map[i][j].connected = false;
      }
    }
    this.connect(
      this.startCell.i,
      this.startCell.j,
      this.direction.any
    );
  }

  connect(i, j, direction) {
    let cell = this.map[i][j];
    if (!!cell && !cell.connected && this.resolveDirection(i, j, direction)) {
      cell.connected = true;
      if (cell.left && i > 0) {
        this.connect(
          i - 1,
          j,
          this.direction.right
        );
      }
      if (cell.right && i < this.columns - 1) {
        this.connect(
          i + 1,
          j,
          this.direction.left
        );
      }
      if (cell.up && j > 0) {
        this.connect(
          i,
          j - 1,
          this.direction.down
        );
      }
      if (cell.down && j < this.rows - 1) {
        this.connect(
          i,
          j + 1,
          this.direction.up
        );
      }
    }
  }

  resolveDirection(i, j, direction) {
    if (direction == this.direction.any) return true;
    if (direction == this.direction.left && this.map[i][j].left) return true;
    if (direction == this.direction.right && this.map[i][j].right) return true;
    if (direction == this.direction.up && this.map[i][j].up) return true;
    if (direction == this.direction.down && this.map[i][j].down) return true;
    return false;
  }

  restart() {
    let i = random(0, this.columns - 1),
      j = random(0, this.rows - 1);

    this.startCell = {
      i: i,
      j: j
    };
    //init map
    this.initMap();
    this.generateMap(createGameMatrix(this.rows, this.columns));
    this.resetConnections();
  }

  generateMap(mapData) {
    for (let i = 0; i < this.columns; i++) {
      for (let j = 0; j < this.rows; j++) {
        let cellType = cellTypes[mapData[i][j]];
        for (let p = 0; p < cellType.length; p++) {
          this.map[j][i][cellType[p]] = true;
        }
        let rand = random(0, 3);
        while (rand--) {
          this.rotateCellCCW(j, i);
        }
      }
    }
  }

  checkSolution() {
    for (let i = 0; i < this.columns; i++) {
      for (let j = 0; j < this.rows; j++) {
        if (!this.map[i][j].connected) return false;
      }
    }
    return true;
  }

  toggleLock(i, j) {
    this.map[i][j].locked = !this.map[i][j].locked;
  }
};