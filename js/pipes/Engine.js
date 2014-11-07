Engine = function (rows, columns) {
    this.rows = rows;
    this.columns = columns;
    this.reset();
}

Engine.prototype = {

    constructor: Engine,
    cellTypes: [
        ["up"],
        ["up", "right"],
        ["up", "down"],
        ["up", "down", "right"],
        ["up", "down", "left", "right"]
    ],
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
            connected: !!connected,
            locked: false
        }
    },

    createRandomCell: function (connected) {
        return {
            up: !!random(0,1),
            down: !!random(0, 1),
            left: !!random(0, 1),
            right: !!random(0, 1),
            connected: !!connected,
            locked: false
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
    reset: function(){
        var i = Math.floor(Math.random() * 9),
        j = Math.floor(Math.random() * 9);

        this.startCell = {
            i: i,
            j: j
        }
        //init map
        this.initMap();
        this.generateMap(games);
        this.resetConnections();
    },
    generateMap: function (mapData) {
        for (var i = 0; i < 10; i++) {
            for (var j = 0; j < 10; j++) {
                var cellType = this.cellTypes[mapData[i][j]];
                for (var p = 0; p < cellType.length; p++) {
                    this.map[j][i][cellType[p]] = true;
                }
                var rand = random(0, 3);
                while (rand--) {
                    this.rotateCellLeft(j, i);
                }
            }
        }
    },
    checkSolution: function () {
        for (var i = 0; i < 10; i++) {
            for (var j = 0; j < 10; j++) {
                if (!this.map[i][j].connected) return false;
            }
        }
        return true;
    },
    toggleLock: function (i, j) {
        this.map[i][j].locked = !this.map[i][j].locked;
    }
}