var Edge = (function () {
    function Edge(one, two) {
        this._one = one;
        this._two = two;
        this._weight = Math.sqrt((two.x - one.x) * (two.x - one.x) + (two.y - one.y) * (two.y - one.y));
    }
    Edge.prototype.equals = function (otherEdge) {
        return this._one.equals(otherEdge._one) && this._two.equals(otherEdge._two);
    };
    Edge.prototype.getOther = function (startingVertex) {
        if (this._two.equals(startingVertex) && !this._one.equals(startingVertex)) {
            return this._one;
        }
        else if (!this._two.equals(startingVertex) && this._one.equals(startingVertex)) {
            return this._two;
        }
        return null;
    };
    Object.defineProperty(Edge.prototype, "one", {
        get: function () {
            return this._one;
        },
        set: function (newOne) {
            this._one = newOne;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Edge.prototype, "two", {
        get: function () {
            return this._two;
        },
        set: function (newTwo) {
            this._two = newTwo;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Edge.prototype, "weight", {
        get: function () {
            return this._weight;
        },
        enumerable: true,
        configurable: true
    });
    return Edge;
}());
var Graph = (function () {
    function Graph() {
        this._vertices = {};
        this._edges = {};
    }
    Graph.prototype.addEdge = function (one, two) {
        if (one.equals(two) || two.equals(one)) {
            return false;
        }
        if (this._edges[one.label + two.label] || this._edges[two.label + one.label]) {
            return false;
        }
        var edge = new Edge(one, two);
        this._edges[one.label + two.label] = edge;
        one.addNeighbor(edge);
        two.addNeighbor(edge);
        return true;
    };
    Graph.prototype.containsEdge = function (edge) {
        if (!edge.one || !edge.two) {
            return false;
        }
        if (this._edges[edge.one.label + edge.two.label] || this._edges[edge.two.label + edge.one.label]) {
            return true;
        }
        return false;
    };
    Graph.prototype.getVertex = function (vertexLabel) {
        return this._vertices[vertexLabel];
    };
    Graph.prototype.addVertex = function (vertex) {
        this._vertices[vertex.label] = vertex;
    };
    Graph.prototype.vertexKeys = function () {
        return Object.keys(this._vertices);
    };
    return Graph;
}());
var Router = (function () {
    function Router() {
        this._vertexMap = {};
        this._adjacentVertices = {};
        var vertices = null;
        var routePoints = document.getElementById("floor-plan").contentDocument.getElementById("route-points").children;
        for (var i = 0; i < routePoints.length; i++) {
            var routePoint = routePoints[i];
            var routePointId = routePoint.getAttribute("id");
            var routePointX = parseFloat(routePoint.getAttribute("cx"));
            var routePointY = parseFloat(routePoint.getAttribute("cy"));
            var neighbors = routePoint.getAttribute("data-neighbors").split(',');
            this._vertexMap[routePointId] = new Vertex(routePointId, routePointX, routePointY);
            this._adjacentVertices[routePointId] = new Array();
            for (var j = 0; j < neighbors.length; j++) {
                this._adjacentVertices[routePointId].push(neighbors[j]);
            }
        }
        routePoints = null;
        this._graph = this.buildGraph();
    }
    Router.prototype.getRoute = function (startingRoom, endingRoom) {
        var unvisited = [];
        var visited = [];
        var distanceMap = {};
        for (var _i = 0, _a = this._graph.vertexKeys(); _i < _a.length; _i++) {
            var vertexLabel = _a[_i];
            unvisited.push(vertexLabel);
            distanceMap[vertexLabel] = (vertexLabel == ("route" + startingRoom + "-1") ? 0 : Number.MAX_VALUE);
        }
        while (visited.length < this._graph.vertexKeys().length) {
            var minVertex = this.getClosestUnvisited(unvisited, distanceMap);
            unvisited.splice(unvisited.indexOf(minVertex.label), 1);
            visited.push(minVertex.label);
            for (var _b = 0, _c = minVertex.neighborhood; _b < _c.length; _b++) {
                var edge = _c[_b];
                var otherVertex = edge.getOther(minVertex);
                if (distanceMap[minVertex.label] + edge.weight < distanceMap[otherVertex.label]) {
                    distanceMap[otherVertex.label] = (distanceMap[minVertex.label] + edge.weight);
                    otherVertex.previous = minVertex;
                }
            }
        }
        unvisited = null;
        visited = null;
        distanceMap = null;
        return this.getPath(this._graph.getVertex("route" + endingRoom + "-1"));
    };
    Router.prototype.buildGraph = function () {
        var graph = new Graph();
        var vertexLabels = Object.keys(this._vertexMap);
        for (var i = 0; i < vertexLabels.length; i++) {
            graph.addVertex(this._vertexMap[vertexLabels[i]]);
        }
        for (var i = 0; i < vertexLabels.length; i++) {
            for (var j = 0; j < this._adjacentVertices[vertexLabels[i]].length; j++) {
                var adjacentLabel = this._adjacentVertices[vertexLabels[i]][j];
                graph.addEdge(this._vertexMap[vertexLabels[i]], this._vertexMap[adjacentLabel]);
            }
        }
        return graph;
    };
    Router.prototype.getClosestUnvisited = function (unvisitedVertices, distanceMap) {
        var min = Number.MAX_VALUE;
        var minVertex = null;
        for (var _i = 0, _a = Object.keys(distanceMap); _i < _a.length; _i++) {
            var label = _a[_i];
            if (unvisitedVertices.indexOf(label) != -1 && distanceMap[label] <= min) {
                min = distanceMap[label];
                minVertex = this._vertexMap[label];
            }
        }
        return minVertex;
    };
    Router.prototype.getPath = function (vertex) {
        var path = new Array();
        path.push(vertex.label);
        while (vertex.previous) {
            vertex = vertex.previous;
            path.push(vertex.label);
        }
        return path.reverse();
    };
    Object.defineProperty(Router.prototype, "graph", {
        get: function () {
            return this._graph;
        },
        enumerable: true,
        configurable: true
    });
    return Router;
}());
var Vertex = (function () {
    function Vertex(vertexLabel, xPosition, yPosition) {
        this._label = vertexLabel;
        this._x = xPosition;
        this._y = yPosition;
        this._neighborhood = [];
        this._previous = null;
    }
    Vertex.prototype.addNeighbor = function (neighbor) {
        if (this._neighborhood.indexOf(neighbor) == -1) {
            this._neighborhood.push(neighbor);
        }
    };
    Vertex.prototype.equals = function (otherVertex) {
        return this._label === otherVertex._label;
    };
    Object.defineProperty(Vertex.prototype, "label", {
        get: function () {
            return this._label;
        },
        set: function (newLabel) {
            this._label = newLabel;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Vertex.prototype, "neighborhood", {
        get: function () {
            return this._neighborhood;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Vertex.prototype, "x", {
        get: function () {
            return this._x;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Vertex.prototype, "y", {
        get: function () {
            return this._y;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Vertex.prototype, "previous", {
        get: function () {
            return this._previous;
        },
        set: function (previousVertex) {
            this._previous = previousVertex;
        },
        enumerable: true,
        configurable: true
    });
    return Vertex;
}());
