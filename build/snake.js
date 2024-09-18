var SnakeNode = /** @class */ (function () {
    function SnakeNode(next, y, x) {
        this.next = next;
        this.x = x;
        this.y = y;
    }
    return SnakeNode;
}());
var SnakeList = /** @class */ (function () {
    function SnakeList() {
        this.tail = new SnakeNode(null, 0, 0);
        this.head = new SnakeNode(null, 0, 0);
        this.body = new SnakeNode(null, 0, 0);
    }
    SnakeList.prototype.reset = function () {
        // Reset logic if necessary
    };
    return SnakeList;
}());
var CreateElements = /** @class */ (function () {
    function CreateElements(root) {
        this.root = root;
        this.root.classList.add("snake---root");
        this.gridElement = document.createElement("div");
        this.gridElement.classList.add("snake---grid");
        this.newGameButton = document.createElement("div");
        this.newGameButton.classList.add("snake---new-game");
        this.newGameButton.innerText = "NEW GAME";
        this.root.appendChild(this.newGameButton);
        this.root.appendChild(this.gridElement);
        this.grid = [];
        for (var i = 0; i < 20; i++) {
            this.grid[i] = [];
            for (var j = 0; j < 20; j++) {
                var square = document.createElement("div");
                square.classList.add("snake---square".concat(i, ".").concat(j), "snake---square");
                this.gridElement.appendChild(square);
                if (i === 0 || i === 19 || j === 0 || j === 19) {
                    square.classList.add("snake---border");
                }
                this.grid[i][j] = {
                    htmlElement: square,
                    hasSnakeOnSquare: false,
                    hasSnakeBody: false,
                    hasApple: false
                };
            }
        }
    }
    return CreateElements;
}());
var Board = /** @class */ (function () {
    function Board(grid, snakeList) {
        this.grid = grid;
        this.snakeList = snakeList;
    }
    Board.prototype.show = function () {
        var current = this.snakeList.tail;
        for (var i = 0; i < 20; i++) {
            for (var j = 0; j < 20; j++) {
                this.grid[i][j].htmlElement.classList.remove("snake---square-on", "snake---has-apple");
                this.grid[i][j].hasSnakeOnSquare = false;
                this.grid[i][j].hasSnakeBody = false;
                if (this.grid[i][j].hasApple) {
                    this.grid[i][j].htmlElement.classList.add("snake---has-apple");
                }
            }
        }
        do {
            var x = current.x, y = current.y;
            if (current.next) {
                this.grid[y][x].hasSnakeBody = true;
            }
            this.grid[y][x].htmlElement.classList.add("snake---square-on");
            this.grid[y][x].hasSnakeOnSquare = true;
            current = current.next;
        } while (current);
    };
    return Board;
}());
var GameFlow = /** @class */ (function () {
    function GameFlow(snakeList, root, board, grid, newGameButton, initializeSnake) {
        this.root = root;
        this.grid = grid;
        this.board = board;
        this.newGameButton = newGameButton;
        this.snakeList = snakeList;
        this.direction = "right";
        this.lastDirection = "";
        this.eventListeners(initializeSnake);
        this.generateApple();
    }
    GameFlow.prototype.moveHead = function () {
        switch (this.direction) {
            case "left":
                this.snakeList.head.x -= 1;
                break;
            case "right":
                this.snakeList.head.x += 1;
                break;
            case "up":
                this.snakeList.head.y -= 1;
                break;
            case "down":
                this.snakeList.head.y += 1;
                break;
        }
    };
    GameFlow.prototype.moveBody = function () {
        var current = this.snakeList.tail;
        do {
            if (current.next) {
                current.x = current.next.x;
                current.y = current.next.y;
                current = current.next;
            }
        } while (current && current.next);
    };
    GameFlow.prototype.eatApple = function () {
        if (this.grid[this.snakeList.head.y][this.snakeList.head.x].hasApple) {
            this.addSnakeNode();
            this.grid[this.snakeList.head.y][this.snakeList.head.x].hasApple = false;
            this.generateApple();
        }
    };
    GameFlow.prototype.generateApple = function () {
        var y, x;
        do {
            y = this.randomNumber();
            x = this.randomNumber();
        } while (this.grid[y][x].hasSnakeOnSquare);
        this.grid[y][x].hasApple = true;
    };
    GameFlow.prototype.randomNumber = function () {
        return Math.floor(Math.random() * 17) + 1;
    };
    GameFlow.prototype.addSnakeNode = function () {
        this.snakeList.head.next = new SnakeNode(null, this.snakeList.head.y, this.snakeList.head.x);
        this.snakeList.head = this.snakeList.head.next;
    };
    GameFlow.prototype.checkForGameOver = function () {
        var _a = this.snakeList.head, x = _a.x, y = _a.y;
        if (this.grid[y][x].hasSnakeBody || x > 18 || x < 1 || y > 18 || y < 1) {
            clearInterval(this.turn);
            this.newGameButton.classList.remove("snake---hidden");
        }
    };
    GameFlow.prototype.changeTurn = function () {
        var _this = this;
        this.turn = setInterval(function () {
            _this.lastDirection = _this.direction;
            _this.moveBody();
            _this.moveHead();
            _this.board.show();
            _this.eatApple();
            _this.checkForGameOver();
        }, 100);
    };
    GameFlow.prototype.eventListeners = function (initializeSnake) {
        var _this = this;
        this.newGameButton.addEventListener("click", function () {
            initializeSnake();
            _this.direction = "right";
            _this.changeTurn();
            _this.newGameButton.classList.add("snake---hidden");
        });
        document.addEventListener("keydown", function (event) {
            if (event.repeat)
                return;
            var keyDirectionMap = {
                37: "left",
                39: "right",
                40: "down",
                38: "up",
            };
            var newDirection = keyDirectionMap[event.keyCode];
            if (newDirection && newDirection !== _this.oppositeDirection(_this.lastDirection)) {
                _this.direction = newDirection;
            }
        });
    };
    GameFlow.prototype.oppositeDirection = function (direction) {
        var opposites = {
            left: "right",
            right: "left",
            up: "down",
            down: "up",
        };
        return opposites[direction];
    };
    return GameFlow;
}());
var Controller = /** @class */ (function () {
    function Controller(root) {
        this.snakeList = new SnakeList();
        this.initializeSnake();
        this.createElements = new CreateElements(root);
        this.grid = this.createElements.grid;
        this.board = new Board(this.grid, this.snakeList);
        this.gameFlow = new GameFlow(this.snakeList, root, this.board, this.grid, this.createElements.newGameButton, this.initializeSnake.bind(this));
    }
    Controller.prototype.initializeSnake = function () {
        this.snakeList.head = new SnakeNode(null, 4, 4);
        this.snakeList.body = new SnakeNode(this.snakeList.head, 4, 3);
        this.snakeList.tail = new SnakeNode(this.snakeList.body, 4, 2);
    };
    return Controller;
}());
var ROOT = document.getElementById("snake");
if (ROOT) {
    new Controller(ROOT);
}
