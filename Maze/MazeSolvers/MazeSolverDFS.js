class MazeSolverDFS extends Maze {

  constructor(widthPx, heightPx, cellWidth) {
    super(widthPx, heightPx, cellWidth);
    this.builRandomMaze();

    // for solving with DFS
    this.visited = [];
    // convert from: (top, right, down, left) to (right, down, left, top)
    this.DFSIndexes = [1, 2, 3, 0];

    this.solvingTime = -1;
    this.pathLength = -1;
  }

  solve() {
    var startTime = millis();
    this.visited = [];
    var resultPath = [];
    // walls are: top right down left: (0,1,2,3)
    //right down left top indexes of walls are: (1,2,3,0) 

    this.startPoint.walls[3] = true; // let there be a wall so DFS wont try to out of bound

    //TODO enter DFS helper.
    var findPath = this.DFShelper(this.startPoint, resultPath);
    if (findPath) {
      resultPath.push(this.startPoint);
      for (var i = 0; i < resultPath.length; i++) {
        resultPath[i].toHighlight = true;
      }
      this.pathLength = resultPath.length;
    }
    else {
      console.log("didnt found a path");
    }

    this.startPoint.walls[3] = false; // fix wall after DFS

    this.solvingTime = (millis() - startTime);
  }

  DFShelper(node, path) {

    this.visited.push(node);
    if (node.equal(this.endPoint)) {
      path.push(node);
      return true;
    }

    var currentWallIndex;
    for (var i = 0; i < this.DFSIndexes.length; i++) {
      currentWallIndex = this.DFSIndexes[i];
      var next = this.getCellFromWall(node, currentWallIndex);
      if (next && !this.isCellVisited(next)) {
        if (this.DFShelper(next, path)) {
          path.push(next);
          return true;
        }
      }
    }

    return false;
  }

  isCellVisited(cell) {
    for (var i = 0; i < this.visited.length; i++) {
      if (cell.equal(this.visited[i])) {
        return true;
      }
    }
    return false;
  }

  solveStepperInit() {
    this.visited = [];
    this.visited.push(this.startPoint);
    this.stack = [];
    this.stack.push(this.startPoint);
    this.current = this.startPoint;
    this.resultPath = [];
    this.iteration = 0;
  }
}