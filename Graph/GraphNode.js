class GraphNode{
    constructor(x, y){
        this.x = x;
        this.y = y;
        this.edges = [];
    }

    addEdge(edge){
        this.edges.push(edge);
    }

    getEdges(){
        return this.edges;
    }

    getConnectedNodes(){
        connections = [];
        for(var i = 0; i < this.edges.length; i++){
            connections.push(this.edges[i].to);
        }
        return connections;
    }

    print(){
        console.log(this.x + ", " + this.y);
    }
}