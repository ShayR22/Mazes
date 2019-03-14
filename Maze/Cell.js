class Cell {
  constructor(i, j, w) {
    this.row = i;
    this.col = j;
    this.width = w;
    //console.log("Cell constructor: " + this.row + ", " + this.col + ". -" + this.width)
    //top right down left
    this.walls = [true, true, true, true];
    this.visited = false;

    this.toHighlight = false;
  }

  highlight() {
    var x = this.col * this.width;
    var y = this.row * this.width;
    noStroke();
    fill(0, 0, 0, 100);
    rect(x, y, this.width, this.width);
  }

  nodeHighlight(){
    var x = this.col * this.width + this.width/2;
    var y = this.row * this.width + this.width/2;
    noStroke();
    fill(0, 0, 0, 100);
    ellipse(x, y, this.width - this.width/2);
  }

  showCell() {
    var x = this.col * this.width;
    var y = this.row * this.width;
    stroke(0);
    strokeWeight(1);
    if (this.walls[0]) {
      line(x, y, x + this.width, y);
    }
    if (this.walls[1]) {
      line(x + this.width, y, x + this.width, y + this.width);
    }
    if (this.walls[2]) {
      line(x + this.width, y + this.width, x, y + this.width);
    }
    if (this.walls[3]) {
      line(x, y + this.width, x, y);
    }

    if (this.visited) {
      noStroke();
      fill(255, 100);
      rect(x, y, this.width, this.width);
      if (this.toHighlight) {
        noStroke();
        fill(255, 0, 0, 100);
        rect(x, y, this.width, this.width);
      }
    }
  }

  print() {
    console.log("cell: (" + this.row + ", " + this.col + ")");
  }


  equal(cell) {
    if (this.row == cell.row && this.col == cell.col) {
      return true;
    }
    return false;
  }

  getCopy(){
    var copy = new Cell(this.row, this.col, this.width);
    for(var i = 0; i < this.walls.length; i++){
      copy.walls[i] = this.walls[i];
    }
    copy.visited = this.visited;
    return copy;
  }
}
