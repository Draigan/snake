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
        this.grid[i][j] = {
          hasSnakeOnSquare: false,
          htmlElement: this.square
        };
      }
    }

  }
  exportElements(): Object {
    this.toExport = {
      grid: this.grid,
    };
    return this.toExport;

  }
}

class Board {
  grid: any;
  constructor(grid: any) {
    //  This is the 2d board array
    this.grid = grid.grid;
    this.squareOn(this.grid[4][4]);
    this.show();

  }
  squareOn(square: any) {
    square.hasSnakeOnSquare = true;
  }
  squareOff(square: any) {
    square.hasSnakeOnSquare = false;
  }
  show() {
    for (let i = 0; i < 20; i++) {
      for (let j = 0; j < 20; j++) {
        if (this.grid[i][j].hasSnakeOnSquare) {
          this.grid[i][j].htmlElement.classList.add("snake---square-on");
        } else {
          this.grid[i][j].htmlElement.classList.remove("snake---square-on");
        }

      }
    }
  }
}

class SnakeNode {
  next: Object;
  prev: Object
  coordinates: number[];
  constructor(next: Object, y, x) {
    this.next = next;
    this.prev = null;
    this.y = y;
    this.x = x;
  }
}
interface Node {
  next: Object;
  prev: Object;
}
class Snake {
  head: Object;
  tail: any;
  body: any;
  grid: Object;
  board: any;
  current: any;
  constructor(board: any) {
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
  move(direction: string) {
    let x: number;
    let y: number;
    switch (direction) {
      case "left":
        for (this.current = this.tail; this.current != null; this.current = this.current.prev) {
          console.log(this.current)
          console.log(this.current.x)
          if (this.current.prev == null) {
            console.log{ "end of the line" }
          }


        }
        break;
      case "right":
        for (this.current = this.tail; this.current != null; this.current = this.current.prev) {
          this.current.coordinates
        }

        break;

    }

  }
}

class Controller {
  createElements: any;
  grid: object;
  board: object;
  snake: Object;
  constructor(root: HTMLElement) {
    // Creating class instances and passing relevant data
    this.createElements = new CreateElements(root);
    this.grid = this.createElements.exportElements();
    this.board = new Board(this.grid);
    this.snake = new Snake(this.board);



  }
}

const snake = new Controller(root);
