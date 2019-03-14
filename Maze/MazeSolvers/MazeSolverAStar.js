
class MazeSolverAStar extends Maze{
    
    constructor(widthPx, heightPx, cellWidth){
        super(widthPx, heightPx, cellWidth);
        this.startPoint = this.grid[0][0];
        this.endPoint = this.grid[this.rows-1][this.cols-1];


        this.hFunctionValues = new Array(this.rows);
        for (var i = 0; i < this.rows; i++) {
            this.hFunctionValues[i] = new Array(this.cols);
        }

        for(var i = 0; i < this.rows; i++){
            for(var j = 0; j < this.cols; j++){
                this.hFunctionValues[i][j] = this.getDistanceBetweenCells(this.grid[i][j], this.endPoint);
            }
        }

        for(var i = 0; i < this.rows; i++){
            for(var j = 0; j < this.cols; j++){
                console.log("cell: (" + i + ", " + j + ") h value is: " + this.hFunctionValues[i][j]);
            }
        }
        
        this.builRandomMaze();
    }

    getDistanceBetweenCells(c1,c2){
        var x = (c2.row - c1.row) * (c2.row - c1.row);
        var y = (c2.col - c1.col) * (c2.col - c1.col);
        return sqrt(x+y);
    }

}