var root = document.getElementById("snake");
var CreateElements = /** @class */ (function () {
    function CreateElements(root) {
        this.root = root;
        this.gridElement = document.createElement("div");
        this.gridElement.classList.add("snake---grid");
        this.root.appendChild(this.gridElement);
        this.grid = [];
        for (var i = 0; i < 20; i++) {
            this.grid[i] = [];
            for (var j = 0; j < 20; j++) {
                this.square = document.createElement("div");
                this.square.classList.add("snake---square".concat(i, ".").concat(j));
                this.square.classList.add("snake---square");
                this.gridElement.appendChild(this.square);
                this.grid[i][j] = {
                    hasSnakeOnSquare: false,
                    htmlElement: this.square
                };
            }
        }
    }
    CreateElements.prototype.exportElements = function () {
        this.toExport = {
            grid: this.grid
        };
        return this.toExport;
    };
    return CreateElements;
}());
var Board = /** @class */ (function () {
    function Board(grid) {
        //  This is the 2d board array
        this.grid = grid.grid;
        this.squareOn(this.grid[4][4]);
        this.show();
    }
    Board.prototype.squareOn = function (square) {
        square.hasSnakeOnSquare = true;
    };
    Board.prototype.squareOff = function (square) {
        square.hasSnakeOnSquare = false;
    };
    Board.prototype.show = function () {
        for (var i = 0; i < 20; i++) {
            for (var j = 0; j < 20; j++) {
                if (this.grid[i][j].hasSnakeOnSquare) {
                    this.grid[i][j].htmlElement.classList.add("snake---square-on");
                }
                else {
                    this.grid[i][j].htmlElement.classList.remove("snake---square-on");
                }
            }
        }
    };
    return Board;
}());
var SnakeNode = /** @class */ (function () {
    function SnakeNode(next, y, x) {
        this.next = next;
        this.prev = null;
        this.y = y;
        this.x = x;
    }
    return SnakeNode;
}());
var Snake = /** @class */ (function () {
    function Snake(board) {
        this.grid = board.grid;
        this.board = board;
        // Define starting snake and link list
        this.tail = new SnakeNode(null, 4, 4);
        this.body = new SnakeNode(this.tail, 4, 5);
        this.head = new SnakeNode(this.body, 4, 6);
        this.tail.prev = this.body;
        this.body.prev = this.head;
        // Set the starting squares to on
        this.board.squareOn(this.grid[4][6]);
        this.board.squareOn(this.grid[4][5]);
        this.board.squareOn(this.grid[4][4]);
        this.current;
        // this.grid[4][10]
        this.move("left");
        this.board.show();
    }
    Snake.prototype.move = function (direction) {
        var x;
        var y;
        switch (direction) {
            case "left":
                for (this.current = this.tail; this.current != null; this.current = this.current.prev) {
                    console.log(this.current);
                    console.log(this.current.x);
                    if (this.current.prev == null) {
                        console.log;
                        {
                            "end of the line";
                        }
                    }
                }
                break;
            case "right":
                for (this.current = this.tail; this.current != null; this.current = this.current.prev) {
                    this.current.coordinates;
                }
                break;
        }
    };
    return Snake;
}());
var Controller = /** @class */ (function () {
    function Controller(root) {
        // Creating class instances and passing relevant data
        this.createElements = new CreateElements(root);
        this.grid = this.createElements.exportElements();
        this.board = new Board(this.grid);
        this.snake = new Snake(this.board);
    }
    return Controller;
}());
var snake = new Controller(root);
