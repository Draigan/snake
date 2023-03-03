const root = document.getElementById("snake");

class CreateElements {
  gridElement: HTMLElement;
  root: HTMLElement;
  grid: Object[][];
  square: HTMLElement;
  toExport: Object;
  constructor(root: HTMLElement) {
    this.root = root;
    this.gridElement = document.createElement("div");
    this.gridElement.classList.add("snake---grid");
    this.root.appendChild(this.gridElement);
    this.grid = [];

    for (let i = 0; i < 20; i++) {
      this.grid[i] = [];
      for (let j = 0; j < 20; j++) {
        this.square = document.createElement("div");
        this.square.classList.add(`snake---square${i}.${j}`);
        this.square.classList.add(`snake---square`);
        this.gridElement.appendChild(this.square);
        if (i == 0 || i == 19 || j == 0 || j == 19) {
          this.square.classList.add("snake---border")
        }
        this.grid[i][j] = {
          htmlElement: this.square,
          hasSnakeOnSquare: false,
          hasSnakeBody: false,
          hasApple: false
        };
      }
    }

  }
}

class Board {
  grid: Object;
  snakeList: Object;
  tail: Object;
  constructor(grid: Object, snakeList: Object) {
    //  This is the 2d board array
    this.snakeList = snakeList;
    this.grid = grid;
    this.tail = snakeList.tail;

  }
  show() {
    let current = this.tail;

    for (let i = 0; i < 20; i++) {
      for (let j = 0; j < 20; j++) {
        this.grid[i][j].htmlElement.classList.remove("snake---square-on");
        this.grid[i][j].htmlElement.classList.remove("snake---has-apple");
        this.grid[i][j].hasSnakeOnSquare = false;
        this.grid[i][j].hasSnakeBody = false;
        if (this.grid[i][j].hasApple) {
          this.grid[i][j].htmlElement.classList.add("snake---has-apple");

        }
      }
    }

    do {
      let x = current.x;
      let y = current.y;

      if (current.next != null) {
        this.grid[y][x].hasSnakeBody = true;
      }

      this.grid[y][x].htmlElement.classList.add("snake---square-on");
      this.grid[y][x].hasSnakeOnSquare = true;
      current = current.next;
    } while (current)
  }
}

class SnakeNode {
  next: Object;
  x: number;
  y: number;

  constructor(next: Object, y: number, x: number) {
    this.next = next;
    this.x = x;
    this.y = y;
  }
}

class SnakeList {
  tail: Object;
  head: Object;
  body: Object;
  constructor() {
    this.tail;
    this.head;
    this.body;
  }
}

class GameFlow {
  direction: string;
  root: HTMLElement;
  head: Object;
  board: Object;
  tail: Object;
  grid: Object[];
  body: Object;
  constructor(snakeList: Object, root: HTMLElement, board: Object, grid: object[]) {
    this.root = root;
    this.grid = grid;
    this.board = board;
    this.direction = "right";
    this.eventListeners();
    this.tail = snakeList.tail;
    this.head = snakeList.head;
    this.body = snakeList.body;
    this.allowMove = true;
    this.changeTurn = this.changeTurn();
    this.generateApple();
  }

  moveHead() {
    switch (this.direction) {
      case "left":
        this.head.x -= 1;
        break;
      case "right":
        this.head.x += 1;
        break;
      case "up":
        this.head.y -= 1;
        break;
      case "down":
        this.head.y += 1;
        break;
    }
  }

  moveBody() {
    let current = this.tail;
    do {
      current.x = current.next.x;
      current.y = current.next.y;
      current = current.next;
    } while (current.next)
  }
  eatApple() {
    if (this.grid[this.head.y][this.head.x].hasApple) {
      this.addSnakeNode();
      this.grid[this.head.y][this.head.x].hasApple = false;
      console.log("WE RAN OVER AN APPLE")
      this.generateApple();
    }
  }
  randomNumber() {
    return Math.floor(Math.random() * 17) + 1
  }
  generateApple() {
    let y = this.randomNumber();
    let x = this.randomNumber();
    if (!this.grid[y][x].hasSnakeOnSquare) {

      this.grid[y][x].hasApple = true;
    } else {
      this.generateApple();
    }
  }
  addSnakeNode() {

    this.head.next = new SnakeNode(null, this.head.y, this.head.x);
    this.head = this.head.next;
  }
  checkForGameOver() {
    let x = this.head.x;
    let y = this.head.y;
    if (this.grid[y][x].hasSnakeBody || x > 18 || x < 1 || y > 18 || y < 1) {
      console.log("GAME OVER")
      clearInterval(this.changeTurn)

    }

  }

  changeTurn() {
    return setInterval(() => {
      this.moveBody();
      this.moveHead();
      this.board.show();
      this.eatApple();
      this.checkForGameOver();
    }, 100);
  }

  eventListeners() {
    document.addEventListener("keydown", (event) => {
      if (event.repeat) return;
      if (event.keyCode == 37 && this.direction != "right") {
        this.direction = "left";
      }
      if (event.keyCode == 39 && this.direction != "left") {
        this.direction = "right";
      }
      if (event.keyCode == 40 && this.direction != "up") {
        this.direction = "down";
      }
      if (event.keyCode == 38 && this.direction != "down") {
        this.direction = "up";
      }
      console.log(this.direction)
    });
  }
}

class Controller {
  createElements: any;
  grid: Object[];
  board: Object;
  snake: Object;
  gameFlow: Object;
  snakeList: Object;
  snakeHead: Object;
  snakeBody: Object;
  snakeTail: Object;
  constructor(root: HTMLElement) {
    // Initializing snake
    this.snakeList = new SnakeList();
    this.snakeHead = new SnakeNode(null, 4, 4);
    this.snakeBody = new SnakeNode(this.snakeHead, 4, 3);
    this.snakeTail = new SnakeNode(this.snakeBody, 4, 2);
    this.snakeList.head = this.snakeHead;
    this.snakeList.tail = this.snakeTail;
    this.snakeList.body = this.snakeBody;
    // Creating class instances and passing relevant data
    this.createElements = new CreateElements(root);
    this.grid = this.createElements.grid;
    this.board = new Board(this.grid, this.snakeList);
    this.gameFlow = new GameFlow(this.snakeList, root, this.board, this.grid);
  }
}

const snake = new Controller(root);

