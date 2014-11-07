Context2D = function (canvas, rows, columns) {
    this.gl = canvas.getContext("2d");
    this.engine = new Engine(rows, columns);
    this.canvas = canvas;
    this.stepX = (this.canvas.width - 1) / this.engine.columns;
    this.stepY = (this.canvas.height - 1) / this.engine.rows;
    this.canvas.addEventListener('mousedown', bind(this, this.onMouseDown), false);
    this.canvas.addEventListener('contextmenu', function (event) { event.preventDefault(); }, false);
    
}

Context2D.prototype = {
    gl: null,
    engine: null,
    canvas: null,
    constructor: Context2D,
    draw: function(){
        var gl = this.gl;
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
                if (this.engine.startCell.i == i && this.engine.startCell.j == j) {
                    var grd = gl.createRadialGradient(positionX, positionY, 1,
                        positionX, positionY, Math.min(this.stepX/2, this.stepY/2));
                    grd.addColorStop(0, "green");
                    grd.addColorStop(1, "black");
                    gl.fillStyle = grd;
                    gl.fillRect(positionX - this.stepX / 2, positionY - this.stepY / 2, this.stepX, this.stepY);
                }

                gl.beginPath();
                var cell = this.engine.map[i][j];
                
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
    onMouseDown: function (event) {
        event.preventDefault();
        var rect = this.canvas.getBoundingClientRect();
        var i = Math.floor((event.clientX - rect.left) / this.stepX);
        var j = Math.floor((event.clientY - rect.top) / this.stepX);

        if (event.button === 0) {
            this.engine.rotateCellLeft(i, j);
        }
        else if (event.button === 2) {
            this.engine.rotateCellRight(i, j);
        }
        this.engine.resetConnections();
        this.draw();
        if (this.engine.checkSolution()) {
            alert("Solved!");
        }
    }
}