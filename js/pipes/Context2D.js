/*
 * Interface between html and game engine. Can be easily replaced by other UI controllers like WebGL context for instance.
 * @author Goran Antic
 *
 */

const Context2D = function(canvas, rows, columns) {
  this.gl = canvas.getContext("2d");
  this.engine = new Engine(rows, columns);
  this.canvas = canvas;
  this.stepX = (this.canvas.width - 1) / this.engine.columns;
  this.stepY = (this.canvas.height - 1) / this.engine.rows;
};

Context2D.prototype = {
  gl: null,
  engine: null,
  canvas: null,
  constructor: Context2D,

  draw: function() {
    var gl = this.gl;
    gl.globalAlpha = 1;
    gl.fillStyle = "Black";
    gl.fillRect(0, 0, this.canvas.width, this.canvas.height);

    //draw grid lines
    gl.strokeStyle = "Gray";
    gl.lineWidth = 1;
    gl.beginPath();
    var positionX = 0,
      positionY = 0;

    //vertical lines by columns
    for (var i = 0; i <= this.engine.columns; i++) {
      positionX = Math.floor(i * this.stepX) + 0.5;
      gl.moveTo(positionX, 0);
      gl.lineTo(positionX, this.canvas.height);
    }
    //horizontal lines by rows
    for (var i = 0; i <= this.engine.rows; i++) {
      positionY = Math.floor(i * this.stepY) + 0.5;
      gl.moveTo(0, positionY);
      gl.lineTo(this.canvas.width, positionY);
    }
    gl.stroke();

    //draw cells
    gl.lineWidth = 3;
    for (var i = 0; i < this.engine.columns; i++) {
      for (var j = 0; j < this.engine.rows; j++) {
        positionX = Math.floor(i * this.stepX + this.stepX / 2) + 0.5;
        positionY = Math.floor(j * this.stepY + this.stepY / 2) + 0.5;
        var cell = this.engine.map[i][j];

        //locked cell
        if (cell.locked) {
          gl.fillStyle = "#0A2A0A";
          gl.fillRect(
            positionX - this.stepX / 2,
            positionY - this.stepY / 2,
            this.stepX,
            this.stepY
          );
        }

        //source cell
        if (this.engine.startCell.i == i && this.engine.startCell.j == j) {
          var grd = gl.createRadialGradient(
            positionX,
            positionY,
            1,
            positionX,
            positionY,
            Math.min(this.stepX / 2, this.stepY / 2)
          );
          grd.addColorStop(0, "green");
          grd.addColorStop(1, "transparent");
          gl.fillStyle = grd;
          gl.fillRect(
            positionX - this.stepX / 2,
            positionY - this.stepY / 2,
            this.stepX,
            this.stepY
          );
        }

        //cell circuit lines
        gl.beginPath();
        if (cell.left) {
          gl.moveTo(positionX, positionY);
          gl.lineTo(positionX - this.stepX / 2, positionY);
        }
        if (cell.right) {
          gl.moveTo(positionX, positionY);
          gl.lineTo(positionX + this.stepX / 2, positionY);
        }
        if (cell.up) {
          gl.moveTo(positionX, positionY);
          gl.lineTo(positionX, positionY - this.stepY / 2);
        }
        if (cell.down) {
          gl.moveTo(positionX, positionY);
          gl.lineTo(positionX, positionY + this.stepY / 2);
        }
        if (cell.connected) {
          gl.strokeStyle = "Chartreuse ";
        } else {
          gl.strokeStyle = "White";
        }
        gl.stroke();
      }
    }
  },

  drawWin: function() {
    var gl = this.gl;
    gl.globalAlpha = 0.8;
    gl.fillStyle = "Black";
    gl.fillRect(0, 0, this.canvas.width, this.canvas.height);

    gl.textAlign = "center";
    gl.font = "30pt Calibri";
    gl.fillStyle = "Chartreuse";
    gl.fillText("You won!", this.canvas.width / 2, this.canvas.height / 2);
  },
  start: function() {
    this.engine.restart();
    this.draw();
  },

  click: function(button, x, y, onWin) {
    var rect = this.canvas.getBoundingClientRect();
    var i = Math.floor((x - rect.left) / this.stepX);
    var j = Math.floor((y - rect.top) / this.stepX);

    //cannot rotate on locked cells
    if (!this.engine.map[i][j].locked) {
      //left click, rotate counter clockwise
      if (button === 0) {
        this.engine.rotateCellCCW(i, j);
      }
      //right click, rotate clockwise
      else if (button === 2) {
        this.engine.rotateCellCW(i, j);
      }
    }
    //lock a cell
    if (button === 1) {
      this.engine.toggleLock(i, j);
    }
    this.engine.resetConnections();
    this.draw();
    if (this.engine.checkSolution()) {
      this.drawWin();
      timer.stop();
      onWin.call();
    }
  }
};
