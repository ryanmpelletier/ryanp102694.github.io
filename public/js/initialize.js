/**
 * Created by ryanb on 3/28/2017.
 */
var navigation = {
    "startRoom":null,
    "endRoom":null,
    "clicks":0
};
var areas;

var router;

var drawRoute = function(directions) {
    var floorPlan = document.getElementById("floor-plan").contentDocument;
    var previousRoute = floorPlan.getElementById('route');
    //checks for previous route, deletes it if there
    if(previousRoute){
        previousRoute.parentNode.removeChild(previousRoute);
    }

    //Creates group to hold all of the route lines
    var routeGroup = floorPlan.createElementNS("http://www.w3.org/2000/svg", "g");
    routeGroup.setAttribute('id', 'route');

    var areas = floorPlan.getElementById('areas');

    //Draws route, from point to point
    for(var i = 1; i < directions.length; i++) {
        if(floorPlan.getElementById(directions[i-1]) == null)
            continue;
        if(floorPlan.getElementById(directions[i]) == null)
            continue;
        drawLine(parseFloat(floorPlan.getElementById(directions[i - 1]).getAttribute('cx')), parseFloat(floorPlan.getElementById(directions[i - 1]).getAttribute('cy')), parseFloat(floorPlan.getElementById(directions[i]).getAttribute('cx')), parseFloat(floorPlan.getElementById(directions[i]).getAttribute('cy')),routeGroup);
    }

    //Draws route group on SVG
    floorPlan.documentElement.appendChild(routeGroup);

    //clear out DOM references
    routeGroup = null;
    floorPlan = null;
    previousRoute = null;
};

var drawLine = function(x1,y1,x2,y2,routeGroup) {
    var newElement = document.getElementById("floor-plan").contentDocument.createElementNS('http://www.w3.org/2000/svg', 'path');
    newElement.setAttribute('d', 'M' + x1 + ',' + y1 + 'L' + x2 + ',' + y2);
    newElement.style.stroke = '#000';
    newElement.style.strokeWidth = '15px';
    routeGroup.appendChild(newElement);

    //clear out DOM references
    newElement = null;
};

// var areaOnClick =

$(window).on('load', function () {
    areas = document.getElementById("floor-plan").contentDocument.getElementById("areas").children;

    function clickHandler(){
        if(navigation.clicks % 2 == 0){
            if(navigation.startRoom != null){
                var room = document.getElementById("floor-plan").contentDocument.getElementById(navigation.startRoom);
                room.style.fill = "white";
                room = null;
            }

            navigation.startRoom = this.id;
            this.style.fill = "blue";
        }else{

            if(navigation.endRoom != null){
                var room = document.getElementById("floor-plan").contentDocument.getElementById(navigation.endRoom);
                room.style.fill = "white";
                room = null;
            }

            navigation.endRoom = this.id;
            this.style.fill="red";
        }
        navigation.clicks++;

        if(navigation.startRoom != null && navigation.endRoom != null){
            router = new Router();
            drawRoute(router.getRoute(navigation.startRoom, navigation.endRoom));
        }
    }

    for(var i = 0; i < areas.length; i++){
        areas[i].onclick  = clickHandler;
    }
});