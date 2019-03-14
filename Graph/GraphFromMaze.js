class GraphFromMaze {
    constructor(maze) {
        var start = millis();
        this.maze = maze;
        this.mazeGrid = maze.grid;
        this.mazeRows = maze.rows;
        this.mazeCols = maze.cols;

        //create a matrix to represent the nodes
        this.nodesMatrix = new Array(maze.rows);
        for (var i = 0; i < this.nodesMatrix.length; i++) {
            this.nodesMatrix[i] = new Array(maze.cols);
        }

        for (var i = 0; i < this.nodesMatrix.length; i++) {
            for (var j = 0; j < this.nodesMatrix[0].length; j++) {
                this.nodesMatrix[i][j] = undefined;
            }
        }
        // this.nodesMatrix[0][0] = maze.grid[0][0];
        // this.nodesMatrix[maze.rows - 1][maze.cols - 1] = maze.grid[maze.rows - 1][maze.cols - 1];
        this.nodesMatrix[0][0] = new GraphNode(0, 0);
        this.nodesMatrix[maze.rows - 1][maze.cols - 1] = new GraphNode(maze.rows - 1, maze.cols - 1);

        this.nodes = [];
        this.cellNodes = this.createNodes();

        this.edges = [];
        this.createEdges();
        var end = millis();

        this.buildTime = round((end - start) * 1000) / 1000;
    }

    createNodes() {

        this.nodes.push(this.nodesMatrix[0][0]);

        for (var i = 0; i < this.mazeRows; i++) {
            for (var j = 0; j < this.mazeCols; j++) {
                // dont check first and last node
                if ((i == 0 && j == 0) || (i == this.mazeRows - 1 && j == this.mazeCols - 1)) {
                    continue;
                }

                if (this.toBeNode(i, j)) {
                    this.nodesMatrix[i][j] = new GraphNode(i, j);
                    this.nodes.push(this.nodesMatrix[i][j]);
                }
            }
        }
        this.nodes.push(this.nodesMatrix[this.mazeRows - 1][this.mazeCols - 1]);
    }


    toBeNode(i, j) {
        /*
            lets assume i have startPoint inside as a node.
            i go over rows:
                if          cell got a path to bottom and has a path to the left or right
                else if     cell doesnt got a path bottom but has a striaght path to node above him
        */
        if(this.isDeadEnd(i,j)){
            return false;
        }
        else if (this.isBottomPath(i, j) && this.isSidePath(i, j))
            return true;
        else if (!this.isBottomPath(i, j) && this.isStraightPathToNodeAbove(i, j))
            return true;
        else
            return false;
    }

    //cell's wall array order: top right down left
    isBottomPath(i, j) {
        return !(this.mazeGrid[i][j].walls[2]);
    }

    //cell's wall array order: top right down left
    isSidePath(i, j) {
        return !(this.mazeGrid[i][j].walls[3] && this.mazeGrid[i][j].walls[1]);
    }

    //cell's wall array order: top right down left
    isDeadEnd(i,j){
        /*
            left top right
            top right down
            right down left
            down left top
        */
        var walls = this.mazeGrid[i][j].walls;

        for(var i = 0; i < walls.length; i++){
            var first = i;
            var second = (i+1) % walls.length;
            var third = (i+2) % walls.length;
        
            if(walls[first] && walls[second] && walls[third]){
                return true;
            }
        }
        return false;
    }

    //cell's wall array order: top right down left
    isStraightPathToNodeAbove(i, j) {
        var currentRow = i;
        var currentTopPath = !(this.mazeGrid[currentRow][j].walls[0]);
        while (currentTopPath) {
            currentRow--;
            if (this.nodesMatrix[currentRow][j] != undefined) {
                return true;
            }
            currentTopPath = !(this.mazeGrid[currentRow][j].walls[0]);
        }
        return false;
    }

    createEdges() {
        for (var i = 0; i < this.nodes.length; i++) {
            this.addEdgeToRightNode(this.nodes[i]);
            this.addEdgeToDownNode(this.nodes[i]);
            this.addEdgeToLeftNode(this.nodes[i]);
            this.addEdgeToTopNode(this.nodes[i]);
        }
    }

    //cell's wall array order: top right down left
    addEdgeToLeftNode(node) {
        var x = node.x;
        var y = node.y;

        while (y >= 0) {
            if (this.mazeGrid[x][y].walls[3]) {
                return; // if there is a wall u cant continue search
            }

            y--;
            if (this.nodesMatrix[x][y] != undefined) {
                this.addEdgeFromToNodes(node, this.nodesMatrix[x][y]);
                return;
            }
        }
    }

    //cell's wall array order: top right down left
    addEdgeToRightNode(node) {
        var x = node.x;
        var y = node.y;

        while (y < this.mazeCols) {
            if (this.mazeGrid[x][y].walls[1]) {
                return; // if there is a wall u cant continue search
            }

            y++;
            if (this.nodesMatrix[x][y] != undefined) {
                this.addEdgeFromToNodes(node, this.nodesMatrix[x][y]);
                return;
            }
        }
    }

    //cell's wall array order: top right down left
    addEdgeToDownNode(node) {
        var x = node.x;
        var y = node.y;

        while (x < this.mazeRows) {
            if (this.mazeGrid[x][y].walls[2]) {
                return; // if there is a wall u cant continue search
            }

            x++;
            if (this.nodesMatrix[x][y] != undefined) {
                this.addEdgeFromToNodes(node, this.nodesMatrix[x][y]);
                return;
            }
        }
    }

    //cell's wall array order: top right down left
    addEdgeToTopNode(node) {
        var x = node.x;
        var y = node.y;

        while (x >= 0) {
            if (this.mazeGrid[x][y].walls[0]) {
                return; // if there is a wall u cant continue search
            }

            x--;
            if (this.nodesMatrix[x][y] != undefined) {
                this.addEdgeFromToNodes(node, this.nodesMatrix[x][y]);
                return;
            }
        }
    }

    addEdgeFromToNodes(from, to){
        var edge = new GraphEdge(from, to);
        this.edges.push(edge);
        from.addEdge(edge);
    }

    

    show(){
        for(var i = 0; i < this.nodes.length; i++){
            this.mazeGrid[this.nodes[i].x][this.nodes[i].y].nodeHighlight();
        }
        for(var i = 0; i < this.edges.length; i++){
            this.edges[i].show(this.mazeGrid[0][0].width);
        }
        
    }
}
