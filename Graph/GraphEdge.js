class GraphEdge {
    constructor(from, to) {
        this.from = from;
        this.to = to;

        this.weight = this.calculateWeight();
        this.from.addEdge(this);
        this.to.addEdge(this);

    }

    calculateWeight() {
        if (this.from.x == this.to.x) 
            return abs(this.from.y - this.to.y);
        else if (this.from.y == this.to.y)
            return abs(this.from.x - this.to.x);
        else
            return sqrt(pow(endX - startX, 2) + pow(endY - startY, 2));
    }

    print() {
        console.log("(" + this.from.x + ", " + this.from.y + ")"
            + " -> " + "(" + this.to.x + ", " + this.to.y + ")"
            + "weight = " + this.weight);
    }


    show(cellWidth){
        var x1,y1,x2,y2;
        x1 = this.from.x * cellWidth + cellWidth/2;
        y1 = this.from.y * cellWidth + cellWidth/2;

        x2 = this.to.x * cellWidth + cellWidth/2;
        y2 = this.to.y *cellWidth + cellWidth/2;
        stroke(0);
        var strokeWeightValue = min(this.weight , 8);
        strokeWeight(strokeWeightValue);

        // the x is the row and y is column of the node therefore a 
        // swap is needed to represent the geometric plain correcly/
        line(y1, x1, y2, x2);
    }

}