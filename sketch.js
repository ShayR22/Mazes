var canvass;
var canvassWidth = 400;
var canvassHeight = 400;
var canvassMinSize = 100;

var frameRateFrequency = 60;
var cellWidth = 25;

var maze;
var mazeBFS;
var mazeDFS;
var mazeAStar;


var mazeForGraph;
var aStarGraphSolver;


function setup() {

  console.log("window dimensions: (" + windowWidth + "," + windowHeight + ")")
  canvass = createCanvas(windowWidth, windowHeight);
  if (canvassWidth <= windowWidth && canvassHeight <= windowHeight) {
    canvass.position(0, 0);
  }

  //init a maze and give to the mazeSolvers
  initMaze();
  // initBFSMazeSolver(maze);
  // initSmartDFSMazeSolver(maze);

  initAStarGraphSolver(maze);

  var numCells = ((canvassWidth - cellWidth) / cellWidth) * ((canvassHeight - cellWidth) / cellWidth);
  console.log("number of cells in maze is: " + numCells)
  console.log("number of nodes in graph is: " + aStarGraphSolver.nodes.length);
  console.log("number of edges in graph is: " + aStarGraphSolver.edges.length);

  frameRate(frameRateFrequency);
  background(0);
  textSize(20);
}


var drawCounter = 0;

function draw() {

  console.log(frameRate());
  //if (drawCounter++ == 500000) {
    /* translate in order to have some border walls */
    var middleScreenX = cellWidth / 2 + windowWidth / 2 - 2*canvassWidth / 2; // created canvas has 2*canvasWidth
    var middleScreenY = cellWidth / 2 + windowHeight / 2 - canvassHeight / 2;
    translate(middleScreenX, middleScreenY);
    maze.showMaze();
    text("Plain Maze", 0,-10);

    /* BFS Drawing */
    // mazeBFS.showMaze();
    //text("BFS solution: " + mazeBFS.solvingTime + " ms, path: " + mazeBFS.pathLength, 0, -10);


    /* smart DFS drawing */
    //translate(canvassWidth,0);
    //text("Smart DFS solution: " + mazeDFS.solvingTime + " ms, path: " + mazeDFS.pathLength ,0, -10);
    //mazeDFS.showMaze();
    // //mazeDFS.solveStep();


    /* graph inside maze drawing */
    translate(canvassWidth, 0);
    mazeForGraph.hightlightNextCellInSolvedPath();
    mazeForGraph.showMaze();
    text("A-Star building+solving time is: " + 
          (aStarGraphSolver.buildGraphAndMazeTime + aStarGraphSolver.solvingTime) + " ms"
           + ", pathLength is: " + aStarGraphSolver.solvePathLength, 0, -10);
    //aStarGraphSolver.show();

 // }
}


function initMaze() {
  //create a maze
  maze = new Maze(canvassWidth - cellWidth, canvassHeight - cellWidth, cellWidth);
  maze.builRandomMaze();
}

function initBFSMazeSolver(maze) {
  // create BFS maze set its grid to the first maze grid
  mazeBFS = new MazeSolverBFS(canvassWidth - cellWidth, canvassHeight - cellWidth, cellWidth);
  mazeBFS.setGrid(maze.grid, maze.rows, maze.cols);
  mazeBFS.solve();
}

function initSmartDFSMazeSolver(maze) {
  mazeDFS = new MazeSolverDFS(canvassWidth - cellWidth, canvassHeight - cellWidth, cellWidth);
  mazeDFS.setGrid(maze.grid, maze.rows, maze.cols);
  mazeDFS.solve();
}

function initAStarGraphSolver(maze) {
  mazeForGraph = new Maze(canvassWidth - cellWidth, canvassHeight - cellWidth, cellWidth);
  mazeForGraph.setGrid(maze.grid, maze.rows, maze.cols);
  aStarGraphSolver = new AStarGraphSolver(mazeForGraph);
  aStarGraphSolver.solve();

}