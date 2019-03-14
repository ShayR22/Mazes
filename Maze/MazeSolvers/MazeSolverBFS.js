class MazeSolverBFS extends Maze {

    constructor(widthPx, heightPx, cellWidth) {
        super(widthPx, heightPx, cellWidth);
        this.builRandomMaze();

        // for solving with DFS
        this.visited;

        this.solvingTime = -1;
        this.pathLength = -1;
    }


    /*
    steps:
    1 - get all the nodes from the stack into temp array
    2 - add to the cameFrom Map each node and who it came from
    3 - extract from each node in the temp array all the nodes it connected to
    and hadent been visited into the stack
    4 - if one of the nodes is end stop searching and trace back its origin using the cameFrom map
    */


    solve() {
        var startTime = millis();

        this.visited = [];
        var stack = [];
        stack.push(this.startPoint);
        this.visited.push(this.startPoint);
        
        var map = new Map();

        if(this.BFShelper(stack, map)){
            var current = this.endPoint;
            var next;
            this.pathLength = 2; // starts from 2 to include startPoint
            do{
                this.pathLength++;
                current.toHighlight = true;
                next = map.get(current);
                current = next;
            }while(!current.equal(this.startPoint))
            this.startPoint.toHighlight = true;
        }
        else{
            console.log("didnt find a path");
        }
        
        this.solvingTime = (millis() - startTime);
        this.solvingTime = round(this.solvingTime * 1000) / 1000;
    }

    BFShelper(stack, map) {
        var nextStack = [];
        while(stack.length > 0){
            var currentCell = stack.pop();
            var neighbors = this.getNotVisitedAviliableCells(currentCell);
            for(var i = 0; i < neighbors.length; i++){
                this.visited.push(neighbors[i]);
                nextStack.push(neighbors[i]);
                map.set(neighbors[i], currentCell);
                if(neighbors[i].equal(this.endPoint)){
                    return true;
                }
            }
        }
        if(this.BFShelper(nextStack, map)){
            return true;
        }
        return false;
    }

    getNotVisitedAviliableCells(cell) {
        var canGoTo = []
        for (var i = 0; i < cell.walls.length; i++) {
            var next = this.getCellFromWall(cell, i);
            if (next && !this.isCellVisited(next)) {
                canGoTo.push(next);
            }
        }
        return canGoTo;
    }

    isCellVisited(cell) {
        for (var i = 0; i < this.visited.length; i++) {
            if (cell.equal(this.visited[i])) {
                return true;
            }
        }
        return false;
    }

}