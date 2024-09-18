interface GridSquare {
  htmlElement: HTMLElement;
  hasSnakeOnSquare: boolean;
  hasSnakeBody: boolean;
  hasApple: boolean;
}

interface SnakeNodeType {
  next: SnakeNodeType | null;
  x: number;
  y: number;
}

class SnakeNode implements SnakeNodeType {
  next: SnakeNodeType | null;
  x: number;
  y: number;

  constructor(next: SnakeNodeType | null, y: number, x: number) {
    this.next = next;
    this.x = x;
    this.y = y;
  }
}

interface SnakeListType {
  tail: SnakeNodeType;
  head: SnakeNodeType;
  body: SnakeNodeType;
}

class SnakeList implements SnakeListType {
  tail: SnakeNodeType;
  head: SnakeNodeType;
  body: SnakeNodeType;

  constructor() {
    this.tail = new SnakeNode(null, 0, 0);
    this.head = new SnakeNode(null, 0, 0);
    this.body = new SnakeNode(null, 0, 0);
  }

  reset() {
    // Reset logic if necessary
  }
}

class CreateElements {
  gridElement: HTMLElement;
  root: HTMLElement;
  grid: GridSquare[][];
  newGameButton: HTMLElement;

  constructor(root: HTMLElement) {
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

    for (let i = 0; i < 20; i++) {
      this.grid[i] = [];
      for (let j = 0; j < 20; j++) {
        const square = document.createElement("div");
        square.classList.add(`snake---square${i}.${j}`, "snake---square");
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
}

class Board {
  grid: GridSquare[][];
  snakeList: SnakeListType;

  constructor(grid: GridSquare[][], snakeList: SnakeListType) {
    this.grid = grid;
    this.snakeList = snakeList;
  }

  show() {
    let current: SnakeNodeType | null = this.snakeList.tail;

    for (let i = 0; i < 20; i++) {
      for (let j = 0; j < 20; j++) {
        this.grid[i][j].htmlElement.classList.remove("snake---square-on", "snake---has-apple");
        this.grid[i][j].hasSnakeOnSquare = false;
        this.grid[i][j].hasSnakeBody = false;

        if (this.grid[i][j].hasApple) {
          this.grid[i][j].htmlElement.classList.add("snake---has-apple");
        }
      }
    }

    do {
      const { x, y } = current;
      if (current.next) {
        this.grid[y][x].hasSnakeBody = true;
      }
      this.grid[y][x].htmlElement.classList.add("snake---square-on");
      this.grid[y][x].hasSnakeOnSquare = true;
      current = current.next;
    } while (current);
  }
}

class GameFlow {
  direction: string;
  root: HTMLElement;
  snakeList: SnakeListType;
  board: Board;
  grid: GridSquare[][];
  newGameButton: HTMLElement;
  lastDirection: string;
  turn: ReturnType<typeof setInterval>;

  constructor(snakeList: SnakeListType, root: HTMLElement, board: Board, grid: GridSquare[][], newGameButton: HTMLElement, initializeSnake: () => void) {
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

  moveHead() {
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
  }

  moveBody() {
    let current = this.snakeList.tail;
    do {
      if (current.next) {
        current.x = current.next.x;
        current.y = current.next.y;
        current = current.next;
      }
    } while (current && current.next);
  }

  eatApple() {
    if (this.grid[this.snakeList.head.y][this.snakeList.head.x].hasApple) {
      this.addSnakeNode();
      this.grid[this.snakeList.head.y][this.snakeList.head.x].hasApple = false;
      this.generateApple();
    }
  }

  generateApple() {
    let y: number, x: number;
    do {
      y = this.randomNumber();
      x = this.randomNumber();
    } while (this.grid[y][x].hasSnakeOnSquare);

    this.grid[y][x].hasApple = true;
  }

  randomNumber() {
    return Math.floor(Math.random() * 17) + 1;
  }

  addSnakeNode() {
    this.snakeList.head.next = new SnakeNode(null, this.snakeList.head.y, this.snakeList.head.x);
    this.snakeList.head = this.snakeList.head.next;
  }

  checkForGameOver() {
    const { x, y } = this.snakeList.head;
    if (this.grid[y][x].hasSnakeBody || x > 18 || x < 1 || y > 18 || y < 1) {
      clearInterval(this.turn);
      this.newGameButton.classList.remove("snake---hidden");
    }
  }

  changeTurn() {
    this.turn = setInterval(() => {
      this.lastDirection = this.direction;
      this.moveBody();
      this.moveHead();
      this.board.show();
      this.eatApple();
      this.checkForGameOver();
    }, 100);
  }

  eventListeners(initializeSnake: () => void) {
    this.newGameButton.addEventListener("click", () => {
      initializeSnake();
      this.direction = "right";
      this.changeTurn();
      this.newGameButton.classList.add("snake---hidden");
    });

    document.addEventListener("keydown", (event) => {
      if (event.repeat) return;

      const keyDirectionMap: Record<number, string> = {
        37: "left",
        39: "right",
        40: "down",
        38: "up",
      };

      const newDirection = keyDirectionMap[event.keyCode];
      if (newDirection && newDirection !== this.oppositeDirection(this.lastDirection)) {
        this.direction = newDirection;
      }
    });
  }

  oppositeDirection(direction: string) {
    const opposites: Record<string, string> = {
      left: "right",
      right: "left",
      up: "down",
      down: "up",
    };
    return opposites[direction];
  }
}

class Controller {
  createElements: CreateElements;
  grid: GridSquare[][];
  board: Board;
  gameFlow: GameFlow;
  snakeList: SnakeListType;

  constructor(root: HTMLElement) {
    this.snakeList = new SnakeList();
    this.initializeSnake();
    this.createElements = new CreateElements(root);
    this.grid = this.createElements.grid;
    this.board = new Board(this.grid, this.snakeList);
    this.gameFlow = new GameFlow(this.snakeList, root, this.board, this.grid, this.createElements.newGameButton, this.initializeSnake.bind(this));
  }

  initializeSnake() {
    this.snakeList.head = new SnakeNode(null, 4, 4);
    this.snakeList.body = new SnakeNode(this.snakeList.head, 4, 3);
    this.snakeList.tail = new SnakeNode(this.snakeList.body, 4, 2);
  }
}

const ROOT = document.getElementById("snake");
if (ROOT) {
  new Controller(ROOT);
}
