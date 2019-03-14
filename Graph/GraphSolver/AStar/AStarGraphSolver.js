class AStarGraphSolver extends GraphFromMaze {
    constructor(maze) {
        var start = millis();
        super(maze);

        // this map will have the path in which each node came from
        // this map will updates its self with shortest path along the algorithm
        this.cameFrom = new Map(); // [key: value] = [node: node]

        // this map will show for each node its cost from the start
        this.moveCost = new Map(); // [key: value] = [node: double] 

        // this map will show the heuristic estimation for each node to the end
        this.heuristic = new Map(); // [key: value] = [node: double]


        this.funcValue = new Map(); // heuristic + moveCost

        //calc heurisitc and set initial movecost to infi
        for (var i = 0; i < this.nodes.length; i++) {
            var heuristicNodeValue = this.getDistanceFromEndPoint(this.nodes[i]);
            this.heuristic.set(this.nodes[i], heuristicNodeValue);
            this.moveCost.set(this.nodes[i], Number.MAX_SAFE_INTEGER);
            this.funcValue.set(this.nodes[i], Number.MAX_SAFE_INTEGER);
        }
        var startNode = this.nodesMatrix[0][0];
        this.moveCost.set(startNode, 0);
        this.funcValue.set(this.nodesMatrix[0][0], this.heuristic.get(startNode));

        this.buildGraphAndMazeTime = floor((millis() - start) * 1000) / 1000;
        this.solvingTime = -1; // will help know solving time in ms
        this.solvePathLength = -1;

    }

    getDistanceFromEndPoint(node) {
        var x1 = this.nodesMatrix[this.mazeRows - 1][this.mazeCols - 1].x;
        var y1 = this.nodesMatrix[this.mazeRows - 1][this.mazeCols - 1].y;
        var x2 = node.x;
        var y2 = node.y;
        return sqrt(pow(x2 - x1, 2) + pow(y2 - y1, 2));
    }

    generateKeyFromNode(node) {
        return node.x + ", " + node.y;
    }

    solve() {
        var startSolvingTime = millis();
        var openSet = new Set();
        var closedSet = new Set();

        openSet.add(this.nodesMatrix[0][0]);
        var currentNode;
        while (!(openSet.length > 0)) {
            currentNode = this.findNeighborWithLowestFuncValue(openSet);

            openSet.delete(currentNode);
            closedSet.add(currentNode);

            if (this.isTargetNode(currentNode)) {
                this.addSolvedPathToMaze();
                break;
            }
            this.calculateStepInPathFromCurrentNode(currentNode, openSet, closedSet);
        }
        this.solvingTime = floor((millis() - startSolvingTime) * 1000) / 1000
    }

    calculateStepInPathFromCurrentNode(node, openSet, closedSet){
        var edges = node.getEdges();

        for (var i = 0; i < edges.length; i++) {
            var neighbor = edges[i].to;

            if (closedSet.has(neighbor))
                continue;

            var moveCostToNeighbor  =this.getMoveCostToNode(node, edges[i]);
            var neighborCurrentMoveCost = this.moveCost.get(neighbor);

            if(!openSet.has(neighbor))
                openSet.add(neighbor);
            else if (neighborCurrentMoveCost >= moveCostToNeighbor) 
                continue;

            this.updateBackTrackingPath(neighbor, node);
            this.updateMoveCost(neighbor, moveCostToNeighbor);
            this.updateFuncValue(neighbor, moveCostToNeighbor, this.heuristic.get(neighbor));
        }
    }

    updateBackTrackingPath(from, to){
        this.cameFrom.set(from, to); 
    }

    updateMoveCost(node, newCost){
        this.moveCost.set(node, newCost); 
    }

    updateFuncValue(node, moveCost, heuristicVal){
        this.funcValue.set(node, moveCost + heuristicVal);
    }

    findNeighborWithLowestFuncValue(nodesSet) {
        var minVal = Number.MAX_SAFE_INTEGER;
        var lowestFuncValCell = undefined;
        var currentCellFuncVal;

        nodesSet.forEach(element => {
            currentCellFuncVal = this.funcValue.get(element);
            if (currentCellFuncVal < minVal) {
                minVal = currentCellFuncVal;
                lowestFuncValCell = element;
            }
        });
        return lowestFuncValCell;
    }

    isTargetNode(node){
        if (node == this.nodesMatrix[this.mazeRows - 1][this.mazeCols - 1]) { // assume start: top left, end: bottom right 
            return true;
        }
        return false;
    }

    getMoveCostToNode(from, targetEdge){
        var fromNodeMoveCost = this.moveCost.get(from);
        var costToGoToTarget = targetEdge.weight;
        return fromNodeMoveCost +  costToGoToTarget;
    }


    printPath() {
        var currenpathNode = this.nodesMatrix[this.mazeRows - 1][this.mazeCols - 1];
        while (currenpathNode != undefined) {
            currenpathNode.print();
            currenpathNode = this.cameFrom.get(currenpathNode);
        }
        console.log("total path length:" + this.funcValue.get(this.nodesMatrix[this.mazeRows - 1][this.mazeCols - 1]));
    }


    printNodeSet(set, setName) {
        set.forEach(element => {
            this.printNodeData(element);
        });
    }

    printNodeData(node) {
        var nodeName = this.generateKeyFromNode(node);
        var nodeMoveVal = this.moveCost.get(node);
        var nodeHeuristicVal = this.heuristic.get(node);
        var nodeFuncVal = this.funcValue.get(node);

        console.log(nodeName + ": (moveVal: " + nodeMoveVal +
            ", heuristicVal:" + nodeHeuristicVal +
            ", nodeFuncVal: " + nodeFuncVal + ")");
    }

    addSolvedPathToMaze(){
        this.solvePathLength = 0;
        var from = this.nodesMatrix[this.mazeRows - 1][this.mazeCols - 1];
        var to = this.cameFrom.get(from);
        while (to != undefined) {
            this.maze.addStrightLineToSolvingPathStack(from.x, from.y, to.x, to.y);
            from = to;
            to = this.cameFrom.get(from);
            this.solvePathLength++;
        }
    }


    highlightPath() {
        this.solvePathLength = 0;
        var from = this.nodesMatrix[this.mazeRows - 1][this.mazeCols - 1];
        var to = this.cameFrom.get(from);
        while (to != undefined) {
            this.maze.paintStraightLineBetweenCells(from.x, from.y, to.x, to.y);
            from = to;
            to = this.cameFrom.get(from);
            this.solvePathLength++;
        }
    }
}
