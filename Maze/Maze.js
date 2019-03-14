class Maze {

  constructor(widthPx, heightPx, cellWidth) {
    this.mazeWidth = widthPx;
    this.mazeHeight = heightPx;
    this.cellWidth = cellWidth;
    this.followPervStepProbability = 0.4;
    this.perv = undefined;
    this.solvedPathStack = [];


    //init
    this.cols = floor(widthPx / cellWidth);
    this.rows = floor(heightPx / cellWidth);

    this.grid = new Array(this.rows);
    for (var i = 0; i < this.rows; i++) {
      this.grid[i] = new Array(this.cols);
    }

    for (var i = 0; i < this.rows; i++) {
      for (var j = 0; j < this.cols; j++) {
        this.grid[i][j] = new Cell(i, j, this.cellWidth);
      }
    }
    // part of maze consturction
    this.startPoint;
    this.endPoint;
  }


  removeWalls(a, b) {
    var x = a.col - b.col;
    if (x === 1) {
      a.walls[3] = false;
      b.walls[1] = false;
    } else if (x === -1) {
      a.walls[1] = false;
      b.walls[3] = false;
    }
    var y = a.row - b.row;
    if (y === 1) {
      a.walls[0] = false;
      b.walls[2] = false;
    } else if (y === -1) {
      a.walls[2] = false;
      b.walls[0] = false;
    }
  }

  index(i, j) {
    var result = i * this.cols + j;

    if (i < 0 || j < 0 || i > this.rows - 1 || j > this.cols - 1) {
      return -1;
    }
    return result;
  }


  checkNeighbors(cell) {
    var currentIndexes = []
    var neighbors = []; // left top right bottom
    var rows = [cell.row - 1, cell.row, cell.row + 1, cell.row]; // left top right down
    var cols = [cell.col, cell.col - 1, cell.col, cell.col + 1]; // left top right down
    for (var i = 0; i < 4; i++) {
      try {
        if (!(this.grid[rows[i]][cols[i]].visited)) {
          neighbors.push(this.grid[rows[i]][cols[i]]);
          currentIndexes.push(i);
        }
      } catch (err) {
        // do nothing
      }
    }

    return this.complicatedMaze(neighbors, currentIndexes);
  }


  complicatedMaze(neighbors, currentIndexes) {

    if (neighbors.length <= 0) {
      return undefined;
    } else if (this.perv == undefined) {
      var r = floor(random(0, neighbors.length));
      this.perv = currentIndexes[r];
      return neighbors[r];
    } else {
      if (random() <= this.followPervStepProbability) {
        // STEP 1: check if pervious direction exist in current directions, if so return it
        for (var i = 0; i < currentIndexes.length; i++) {
          if (currentIndexes[i] == this.perv) {
            return neighbors[i];
          }
        }
      }
      var r = floor(random(0, neighbors.length));
      this.perv = currentIndexes[r];
      return neighbors[r];
    }
  }

  simpleMaze(neighbors) {
    if (neighbors.length > 0) {
      var r = floor(random(0, neighbors.length));
      return neighbors[r];
    } else {
      return undefined;
    }
  }

  longMaze(neighbors) {
    if (neighbors.length > 0) {
      var r;
      if (floor(random(0, 3)) == 0) {
        r = 0
      } else {
        r = floor(random(0, neighbors.length));
      }
      return neighbors[r];
    } else {
      return undefined;
    }
  }

  builRandomMaze() {
    this.startPoint = this.grid[0][0];
    this.endPoint = this.grid[this.rows - 1][this.cols - 1];

    // remove entry and exit walls
    this.startPoint.walls[3] = false;
    this.endPoint.walls[1] = false;

    var stack = [];
    var current = this.startPoint;
    var next;

    var keepBuild = true;
    while (keepBuild) {
      next = this.checkNeighbors(current);
      if (next) {
        next.visited = true;
        stack.push(current);
        this.removeWalls(current, next);
        current = next;

      } else if (stack.length > 0) {
        current = stack.pop();

      } else {
        //console.log("ended building");
        keepBuild = false;
      }
    }
  }


  // walls are: top right down left: (0,1,2,3)
  // assumption all boundary walls are true
  getCellFromWall(cell, indexWall) {
    if (!cell.walls[indexWall]) {
      switch (indexWall) {
        case 0:
          {
            return this.grid[cell.row - 1][cell.col];
          }
        case 1:
          {
            return this.grid[cell.row][cell.col + 1];
          }
        case 2:
          {
            return this.grid[cell.row + 1][cell.col];
          }
        case 3:
          {
            return this.grid[cell.row][cell.col - 1];
          }
        default:
          {
            return undefined;
          }

      }
    } else {
      return undefined;
    }
  }

  setGrid(grid, rows, cols) {
    this.rows = rows;
    this.cols = cols;

    this.grid = new Array(this.rows);
    for (var i = 0; i < this.rows; i++) {
      this.grid[i] = new Array(this.cols);
    }

    for (var i = 0; i < this.rows; i++) {
      for (var j = 0; j < this.cols; j++) {
        this.grid[i][j] = grid[i][j].getCopy();
      }
    }

    this.startPoint = this.grid[0][0];
    this.endPoint = this.grid[this.rows - 1][this.cols - 1];
  }


  addStrightLineToSolvingPathStack(x1, y1, x2, y2) {
    if (x1 == x2) {
      if (y1 > y2) {
        for (var i = y1; i >= y2; i--) {
          this.solvedPathStack.push(this.grid[x1][i]);
        }
      } else {
        for (var i = y1; i <= y2; i++) {
          this.solvedPathStack.push( this.grid[x1][i]);
        }
      }
    } else if (y1 == y2) {
      if (x1 > x2) {
        for (var i = x1; i >= x2; i--) {
          this.solvedPathStack.push(this.grid[i][y1]);
        }
      } else {
        for (var i = x1; i <= x2; i++) {
          this.solvedPathStack.push(this.grid[i][y1]);
        }
      }
    }
  }

  hightlightNextCellInSolvedPath() {
    if (this.solvedPathStack.length > 0) {
      var cell = this.solvedPathStack.pop();
      cell.toHighlight = true;
      return true;
    }
    return false;
  }

  paintStraightLineBetweenCells(x1, y1, x2, y2) {
    if (x1 == x2) {
      if (y1 < y2)
        this.paintVertical(y1, y2, x1);
      else
        this.paintVertical(y2, y1, x1);
    } else if (y1 == y2) {
      if (x1 < x2)
        this.paintHorizontal(x1, x2, y1);
      else
        this.paintHorizontal(x2, x1, y1);
    }
  }

  paintVertical(lower, higher, yValue) {
    var range = higher - lower;
    var currentCell;
    for (var i = 0; i <= range; i++) {
      currentCell = this.grid[yValue][i + lower];
      currentCell.toHighlight = true;
    }
  }

  paintHorizontal(lower, higher, xValue) {
    var range = higher - lower;
    var currentCell;
    for (var i = 0; i <= range; i++) {
      currentCell = this.grid[i + lower][xValue];
      currentCell.toHighlight = true;
    }
  }

  showMaze() {
    for (var i = 0; i < this.rows; i++) {
      for (var j = 0; j < this.cols; j++) {
        this.grid[i][j].showCell();
      }
    }
    fill(255, 0, 0);
    rect(0 - cellWidth / 2, 0, cellWidth / 2, cellWidth);
    rect(this.mazeWidth, (this.mazeHeight - cellWidth), cellWidth / 2, cellWidth);
  }


}
