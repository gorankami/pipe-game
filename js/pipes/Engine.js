Engine = function (rows, columns) {
    this.rows = rows;
    this.columns = columns;
    var i = Math.floor(Math.random() * 9),
        j = Math.floor(Math.random() * 9);

    this.startCell = {
        i: i,
        j: j
    }
    //init map
    this.initMap(true);
    var cellsForConnecting = [];
    this.addToStack(cellsForConnecting,i, j, this.direction.any);
    //this.generateMap(cellsForConnecting);
    this.resetConnections();
}

Engine.prototype = {

    constructor: Engine,

    rows: 0,
    columns: 0,
    map: [],
    startCell: {i:0,j:0},
    direction: {
        any: 0,
        left: 1,
        right: 2,
        up: 3,
        down: 4
    },
    initMap : function(randomize){
        this.map = [];
        for (var i = 0; i < this.rows; i++) {
            this.map[i] = [];
            for (var j = 0; j < this.columns; j++) {
                this.map[i][j] = randomize ? this.createRandomCell() : this.createEmptyCell();
            }
        }
    },

    createEmptyCell: function (connected) {
        return {
            up: false,
            down: false,
            left: false,
            right: false,
            connected: !!connected
        }
    },

    createRandomCell: function (connected) {
        return {
            up: !!random(0,1),
            down: !!random(0, 1),
            left: !!random(0, 1),
            right: !!random(0, 1),
            connected: !!connected
        }
        
    },

    rotateCellLeft: function (i, j) {
        var cell = this.map[i][j];
        var temp = cell.left;
        cell.left = cell.up;
        cell.up = cell.right;
        cell.right = cell.down;
        cell.down = temp;
    },

    rotateCellRight: function (i, j) {
        var cell = this.map[i][j];
        var temp = cell.left;
        cell.left = cell.down;
        cell.down = cell.right;
        cell.right = cell.up;
        cell.up = temp;
    },

    resetConnections: function(){
        for (var i = 0; i < this.rows; i++) {
            for (var j = 0; j < this.columns; j++) {
                this.map[i][j].connected = false;
            }
        }
        this.connect(this.startCell.i,this.startCell.j,this.direction.any);
    },

    connect: function (i,j, direction) {
        var cell = this.map[i][j];
        if (!!cell && !cell.connected && this.resolveDirection(i,j,direction)) {
            cell.connected = true;
            if (cell.left && i>0) {
                this.connect(i - 1, j, this.direction.right);
            }
            if (cell.right && i < this.columns-1) {
                this.connect(i + 1, j, this.direction.left);
            }
            if (cell.up && j >0) {
                this.connect(i, j - 1, this.direction.down);
            }
            if (cell.down && j< this.rows-1) {
                this.connect(i, j + 1, this.direction.up);
            }
        }
    },
    resolveDirection: function(i,j,direction){
        if (direction == this.direction.any) return true;
        if (direction == this.direction.left && this.map[i][j].left) return true;
        if (direction == this.direction.right && this.map[i][j].right) return true;
        if (direction == this.direction.up && this.map[i][j].up) return true;
        if (direction == this.direction.down && this.map[i][j].down) return true;
        return false;
    },

    generateMap: function (cellsForConnecting) {
        var temp = cellsForConnecting.pop();
        var i = temp.i,
            j = temp.j,
            direction = temp.direction;

        var cell = this.map[i][j],
            cellUp = i > 0 ? this.map[i - 1][j] : null,
            cellDown = i < this.rows - 1 ? this.map[i + 1][j] : null,
            cellLeft = j > 0 ? this.map[i][j - 1] : null,
            cellRight = i < this.columns ? this.map[i][j + 1] : null;
        cell.connected = true;

        if (direction == this.direction.up) {
            cell.up = true;
        }else if (direction == this.direction.down) {
            cell.down = true;
        }else if (direction == this.direction.left) {
            cell.left = true;
        }else if(direction == this.direction.right) {
            cell.right = true;
        }

        var availableConnections = [];
        if(cellUp    && !cellUp.connected    && !cell.up) availableConnections.push("up");
        if(cellDown  && !cellDown.connected  && !cell.down ) availableConnections.push("down");
        if(cellLeft  && !cellLeft.connected  && !cell.left ) availableConnections.push("left");
        if(cellRight && !cellRight.connected && !cell.right) availableConnections.push("right");

        var numToConnect = random(direction == this.direction.any?1:0, availableConnections.length);
        var toConnect = [];
        while (numToConnect--) {
            var n = random(0, availableConnections.length);
            cell[availableConnections[n]] = true;
            toConnect.push(availableConnections[n]);
        }
        for(var p =0;p<toConnect.length;p++){
            if (toConnect[p] == "up") this.addToStack(cellsForConnecting, i - 1, j, this.direction.down);
            if (toConnect[p] == "down") this.addToStack(cellsForConnecting, i + 1, j, this.direction.up);
            if (toConnect[p] == "left") this.addToStack(cellsForConnecting, i, j-1, this.direction.right);
            if (toConnect[p] == "right") this.addToStack(cellsForConnecting, i, j+1, this.direction.left);
        }
        if (cellsForConnecting.length > 0) {
            this.generateMap(cellsForConnecting);
        }
    },
    addToStack: function (stack, i, j, direction) {
        for (var p = 0; p < stack.length; p++) {
            if (stack[p].i == i && stack[p].j == j) return;
        }
        stack.push({
            i: i,
            j: j,
            direction:direction
        });
    }
}