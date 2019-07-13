
var nextId = 0;

function ShapeManager(container, item) {
    this.container = container;
    this.item = item;
}

ShapeManager.uid = function () {
    return ++nextId;
};

// UTILITAIRE : Renvoie le % de la valeur par rapport au conteneur de la viewbox
ShapeManager.prototype.getPercent = function (container, coord) {
    var percent = (coord * 100) / container;
    return parseFloat(percent).toFixed(4);
};

// UTILITAIRE : Ajuste x/y à la fenetre de l'écran utilisateur
ShapeManager.prototype.adjustCoord = function (container, percent) {
    var coord = (percent * container) / 100;
    return Math.round(coord);
};

// UTILITAIRE : Transforme l'attribut percents en tableau (hors polyline)
ShapeManager.prototype.percToTab = function (percs) {
    var tab = [];
    var chain = percs.split(",");
    for (var i = 0; i < chain.length; i++) {
        tab.push(parseFloat(chain[i]));
    }
    return tab;
};

// POLYLINE : ajuste x/y à la fenetre de l'écran utilisateur
ShapeManager.prototype.adjustTabCoord = function (containerX, containerY, percTab) {
    var coords = percTab.split(",");
    var coordX = Math.round(((coords[0] * containerX) / 100));
    var coordY = Math.round(((coords[1] * containerY) / 100));
    var coord = coordX + "," + coordY;
    return coord;
};


// POLYLINE : Fonction qui transforme les attributs points/percents en tableau
ShapeManager.prototype.polyToTab = function (string) {
    var tab = [];
    var chain = string.split(" ");
    for (var i = 0; i < chain.length; i++) {
        if (chain[i].length !== 0) {
            tab.push(chain[i]);
        }
    }
    return tab;
};

// POLYLINE : calcule la distance entre x1/x2 et y1/y2
ShapeManager.prototype.polyDist = function (coordsOne, cursor) {
    var coord = coordsOne.split(",");
    var distX = cursor.x - coord[0];
    var distY = cursor.y - coord[1];
    var dist = [distX, distY];
    return dist;
};

// POLYLINE : renvoie les nouveaux coordonnées en cas de déplacement de la forme
ShapeManager.prototype.polyMove = function (tabCoord, dist) {
    var coord = tabCoord.split(",");
    var coordX = parseInt(coord[0]) + dist[0];
    var coordY = parseInt(coord[1]) + dist[1];
    var coords = [coordX, coordY];
    return coords;
};


// GLOBAL : Fonction qui instancie une nouvelle forme
ShapeManager.prototype.newShape = function (style, cursor) {

    switch (style.type) {

        case "rect":
            var shape = new Rect();
            shape.id = "rect" + ShapeManager.uid();
            // type dépendra de la palette du user
            shape.type = style.type;
            // x, y dépendra du curseur du user
            shape.x = cursor.x;
            shape.y = cursor.y;
            // A l'instanciation une hauteur/largeur par défaut est chargée
            shape.width = 100;
            shape.height = 50;
            // Récupère le pourcentage des dimensions pour s'adapter aux users
            shape.percents = [this.getPercent(this.container[0], shape.x),
                this.getPercent(this.container[1], shape.y),
                this.getPercent(this.container[0], shape.width),
                this.getPercent(this.container[1], shape.height)];
            // stroke et strokeW dépendra de la palette du user
            shape.stroke = style.stroke;
            shape.strokeW = style.strokeW;
            break;

        case "line":
            var shape = new Line();
            shape.id = "line" + ShapeManager.uid();
            shape.type = style.type;
            shape.x1 = cursor.x;
            shape.y1 = cursor.y;
            // A l'instanciation, un x2/y2 est défini par défaut pour initialiser un point visible
            shape.x2 = cursor.x + 10;
            shape.y2 = cursor.y + 10;
            shape.percents = [this.getPercent(this.container[0], shape.x1),
                this.getPercent(this.container[1], shape.y1),
                this.getPercent(this.container[0], shape.x2),
                this.getPercent(this.container[1], shape.y2)];
            // stroke et strokeW dépendra de la palette du user
            shape.stroke = style.stroke;
            shape.strokeW = style.strokeW;
            break;

        case "polyline":
            var shape = new Polyline();
            shape.id = "polyline" + ShapeManager.uid();
            shape.type = style.type;
            // Points = concaténation du cursus x et y du user
            shape.points = cursor.x + "," + cursor.y;
            shape.percents = this.getPercent(this.container[0], cursor.x) + "," + this.getPercent(this.container[1], cursor.y);
            // stroke et strokeW dépend de la palette du user
            shape.stroke = style.stroke;
            shape.strokeW = style.strokeW;
            break;

        case "draw":
            var shape = new Polyline();
            shape.id = "draw" + ShapeManager.uid();
            shape.type = "draw";
            // Points = concaténation du cursus x et y du user
            shape.points = cursor.x + "," + cursor.y;
            shape.percents = this.getPercent(this.container[0], cursor.x) + "," + this.getPercent(this.container[1], cursor.y);
            // stroke et strokeW dépend de la palette du user
            shape.stroke = style.stroke;
            shape.strokeW = style.strokeW;
            break;

        case "ellipse":
            var shape = new Ellipse();
            shape.id = "ellipse" + ShapeManager.uid();
            shape.type = style.type;
            // x, y dépendra du curseur du user
            shape.cx = cursor.x;
            shape.cy = cursor.y;
            shape.rx = 60;
            shape.ry = 30;
            shape.percents = [this.getPercent(this.container[0], shape.cx),
                this.getPercent(this.container[1], shape.cy),
                this.getPercent(this.container[0], shape.rx),
                this.getPercent(this.container[1], shape.ry)];
            // Fill est passé en none par défaut (transparent)
            // stroke et strokeW dépendra de la palette du user
            shape.stroke = style.stroke;
            shape.strokeW = style.strokeW;
            break;

        default:
            console.log("Shape Unknown");
            break;
    }
    return shape;
};

// GLOBAL : Fonction qui récupère l'élément DOM sélectionné et transforme en objet
ShapeManager.prototype.getShape = function () {

    var elt = document.getElementById(this.item.id);

    switch (elt.getAttribute("data-type")) {

        case "rect":
            var shape = new Rect();
            shape.type = this.item.type;
            shape.id = elt.getAttribute("id");
            shape.x = elt.getAttribute("x");
            shape.y = elt.getAttribute("y");
            shape.width = elt.getAttribute("width");
            shape.height = elt.getAttribute("height");
            shape.percents = this.percToTab(elt.getAttribute("percents").toString());
            shape.fill = elt.getAttribute("fill");
            shape.stroke = elt.getAttribute("stroke");
            shape.strokeW = elt.getAttribute("stroke-width");
            break;

        case "line":
            var shape = new Line();
            shape.type = this.item.type;
            shape.id = elt.getAttribute("id");
            shape.x1 = elt.getAttribute("x1");
            shape.y1 = elt.getAttribute("y1");
            shape.x2 = elt.getAttribute("x2");
            shape.y2 = elt.getAttribute("y2");
            shape.percents = this.percToTab(elt.getAttribute("percents").toString());
            shape.stroke = elt.getAttribute("stroke");
            shape.strokeW = elt.getAttribute("stroke-width");
            break;


        case "draw":
            var shape = new Polyline();
            shape.type = "draw";
            shape.id = elt.getAttribute("id");
            shape.points = elt.getAttribute("points").toString();
            shape.percents = elt.getAttribute("percents").toString();
            shape.fill = elt.getAttribute("fill");
            shape.stroke = elt.getAttribute("stroke");
            shape.strokeW = elt.getAttribute("stroke-width");
            break;


        case "polyline":
            var shape = new Polyline();
            shape.type = this.item.type;
            shape.id = elt.getAttribute("id");
            shape.points = elt.getAttribute("points");
            shape.percents = elt.getAttribute("percents");
            shape.fill = elt.getAttribute("fill");
            shape.stroke = elt.getAttribute("stroke");
            shape.strokeW = elt.getAttribute("stroke-width");
            break;

        case "ellipse":
            var shape = new Ellipse();
            shape.type = this.item.type;
            shape.id = elt.getAttribute("id");
            shape.cx = elt.getAttribute("cx");
            shape.cy = elt.getAttribute("cy");
            shape.rx = elt.getAttribute("rx");
            shape.ry = elt.getAttribute("ry");
            shape.percents = this.percToTab(elt.getAttribute("percents").toString());
            shape.fill = elt.getAttribute("fill");
            shape.stroke = elt.getAttribute("stroke");
            shape.strokeW = elt.getAttribute("stroke-width");
            break;

        default:
            console.log("Shape Unknown");
            break;
    }
    return shape;
};


// GLOBAL : Méthode qui suit le curseur du user pour définir la dimension de la forme
// Implémentation : à coupler avec un longClick - mousedown
ShapeManager.prototype.traceShape = function (obj, cursor) {

    switch (obj.type) {

        case "rect":
            var startX = obj.x;
            var startY = obj.y;

            if (startX < cursor.x && startY < cursor.y) {
                obj.width = cursor.x - startX;
                obj.height = cursor.y - startY;
            }

            // Récupère le pourcentage des dimensions pour s'adapter aux users
            obj.percents = [this.getPercent(this.container[0], obj.x),
                this.getPercent(this.container[1], obj.y),
                this.getPercent(this.container[0], obj.width),
                this.getPercent(this.container[1], obj.height)];
            break;

        case "line":
            obj.x2 = cursor.x;
            obj.y2 = cursor.y;

            obj.percents = [this.getPercent(this.container[0], obj.x1),
                this.getPercent(this.container[1], obj.y1),
                this.getPercent(this.container[0], obj.x2),
                this.getPercent(this.container[1], obj.y2)];
            break;

        case "draw":
            var draw = document.getElementById(obj.id);
            currPoint = cursor.x + "," + cursor.y;
            currPerc = this.getPercent(this.container[0], cursor.x) + "," + this.getPercent(this.container[1], cursor.y);

            var eltGetPoints = this.polyToTab(draw.getAttribute("points"));
            var eltGetPercents = this.polyToTab(draw.getAttribute("percents"));
            eltGetPoints.push(currPoint);
            eltGetPercents.push(currPerc);
            var spacePoints;
            var spacePercents;
            for (var i = 0; i < eltGetPoints.length; i++) {
                if (i === 0) {
                    spacePoints = eltGetPoints[i];
                    spacePercents = eltGetPercents[i];
                } else {
                    spacePoints = spacePoints + " " + eltGetPoints[i];
                    spacePercents = spacePercents + " " + eltGetPercents[i];
                }
            }
            obj.points = spacePoints;
            obj.percents = spacePercents;
            break;

        case "polyline":
            var polyline = document.getElementById(obj.id);
            currPoint = cursor.x + "," + cursor.y;
            currPerc = this.getPercent(this.container[0], cursor.x) + "," + this.getPercent(this.container[1], cursor.y);

            var eltGetPoints = this.polyToTab(polyline.getAttribute("points"));
            var eltGetPercents = this.polyToTab(polyline.getAttribute("percents"));
            var eltGetStacks = parseInt(polyline.getAttribute("stacks"));
            var x = eltGetStacks + 1;

            if (eltGetStacks > 0) {

                if (eltGetPoints.length > x) {
                    eltGetPoints.splice(eltGetPoints.length - 1, 1);
                    eltGetPoints.splice(eltGetPercents.length - 1, 1);
                }
                eltGetPoints.push(currPoint);
                eltGetPercents.push(currPerc);

            } else {
                if (eltGetPoints.length > 1) {
                    eltGetPoints.splice(eltGetPoints.length - 1, 1);
                    eltGetPoints.splice(eltGetPercents.length - 1, 1);
                }
                eltGetPoints.push(currPoint);
                eltGetPercents.push(currPerc);
            }

            var spacePoints;
            var spacePercents;
            for (var i = 0; i < eltGetPoints.length - 1; i++) {
                if (i === 0) {
                    spacePoints = eltGetPoints[i];
                    spacePercents = eltGetPercents[i];
                } else {
                    spacePoints = spacePoints + " " + eltGetPoints[i];
                    spacePercents = spacePercents + " " + eltGetPercents[i];
                }
            }
            spacePoints = spacePoints + " " + currPoint;
            spacePercents = spacePercents + " " + currPerc;
            obj.points = spacePoints;
            obj.percents = spacePercents;

            break;

        case "ellipse":
            var startX = obj.cx;
            var startY = obj.cy;

            if (startX < cursor.x && startY < cursor.y) {
                obj.rx = (cursor.x - startX) * 2;
                obj.ry = (cursor.y - startY) * 2;
            }

            obj.percents = [this.getPercent(this.container[0], obj.cx),
                this.getPercent(this.container[1], obj.cy),
                this.getPercent(this.container[0], obj.rx),
                this.getPercent(this.container[1], obj.ry)];
            break;

        case "default":
            console.log("Shape unknown");
            break;
    }
    return obj;
};

// GLOBAL : fonction qui permet de déplacer la forme
// Implémentation : à coupler avec un longClick - mousemove
ShapeManager.prototype.moveShape = function (obj, cursor) {

    switch (obj.type) {

        case "rect":
            obj.x = cursor.x;
            obj.y = cursor.y;

            // Récupère le pourcentage des dimensions pour s'adapter aux users
            obj.percents = [this.getPercent(this.container[0], obj.x),
                this.getPercent(this.container[1], obj.y),
                this.getPercent(this.container[0], obj.width),
                this.getPercent(this.container[1], obj.height)];
            break;

        case "line":
            var startX1 = obj.x1;
            var startY1 = obj.y1;
            var startX2 = obj.x2;
            var startY2 = obj.y2;
            var distX = startX2 - startX1;
            var distY = startY2 - startY1;

            obj.x1 = cursor.x;
            obj.y1 = cursor.y;
            obj.x2 = cursor.x + distX;
            obj.y2 = cursor.y + distY;

            obj.percents = [this.getPercent(this.container[0], obj.x1),
                this.getPercent(this.container[1], obj.y1),
                this.getPercent(this.container[0], obj.x2),
                this.getPercent(this.container[1], obj.y2)];
            break;

        case "draw":
            var draw = document.getElementById(obj.id);
            var eltGetPoints = this.polyToTab(draw.getAttribute("points"));
            var dist = this.polyDist(eltGetPoints[0], cursor);
            var spacePoints;
            var spacePercents;
            for (var i = 0; i < eltGetPoints.length; i++) {
                var coord = this.polyMove(eltGetPoints[i], dist);
                var defCoords = coord[0] + "," + coord[1];
                var defPercs = this.getPercent(this.container[0], coord[0]) + "," + this.getPercent(this.container[1], coord[1]);
                if (i === 0) {
                    spacePoints = defCoords;
                    spacePercents = defPercs;
                } else {
                    spacePoints = spacePoints + " " + defCoords;
                    spacePercents = spacePercents + " " + defPercs;
                }
            }
            obj.points = spacePoints;
            obj.percents = spacePercents;
            break;

        case "polyline":
            var polyline = document.getElementById(obj.id);
            var eltGetPoints = this.polyToTab(polyline.getAttribute("points"));
            var dist = this.polyDist(eltGetPoints[0], cursor);
            var spacePoints;
            var spacePercents;

            for (var i = 0; i < eltGetPoints.length; i++) {
                var coord = this.polyMove(eltGetPoints[i], dist);
                var defCoords = coord[0] + "," + coord[1];
                var defPercs = this.getPercent(this.container[0], coord[0]) + "," + this.getPercent(this.container[1], coord[1]);
                if (i === 0) {
                    spacePoints = defCoords;
                    spacePercents = defPercs;
                } else {
                    spacePoints = spacePoints + " " + defCoords;
                    spacePercents = spacePercents + " " + defPercs;
                }
            }
            obj.points = spacePoints;
            obj.percents = spacePercents;
            break;

        case "ellipse":
            obj.cx = cursor.x;
            obj.cy = cursor.y;

            obj.percents = [this.getPercent(this.container[0], obj.cx),
                this.getPercent(this.container[1], obj.cy),
                this.getPercent(this.container[0], obj.rx),
                this.getPercent(this.container[1], obj.ry)];
            break;

        case "default":
            console.log("No shape selected");
            break;
    }
    return obj;
};

// GLOBAL : redimensionne la forme ellipse=>Circle and rect=>square
// Implémentation : à coupler avec un checkShiftKey
ShapeManager.prototype.resizeShape = function (obj) {

    switch (obj.type) {

        case "rect":
            var targetWidth = obj.width;
            var targetHeight = obj.height;
            // si la hauteur et largeur ne sont pas égales je redimensionne la hauteur sur la largeur
            if (targetWidth != targetHeight) {
                obj.width = targetHeight;
            }

            // Récupère le pourcentage des dimensions pour s'adapter aux users
            obj.percents = [this.getPercent(this.container[0], obj.x),
                this.getPercent(this.container[1], obj.y),
                this.getPercent(this.container[0], obj.width),
                this.getPercent(this.container[1], obj.height)];
            break;

        case "ellipse":
            var rx = obj.rx;
            var ry = obj.ry;
            // si la hauteur et largeur ne sont pas égales je redimensionne la hauteur sur la largeur
            if (rx != ry) {
                obj.rx = ry;
            }
            obj.percents = [this.getPercent(this.container[0], obj.cx),
                this.getPercent(this.container[1], obj.cy),
                this.getPercent(this.container[0], obj.rx),
                this.getPercent(this.container[1], obj.ry)];
            break;

        case "default":
            console.log("Shape can't be resized");
            break;
    }
    return obj;
};


// UTILITAIRE : fonction qui permet de calculer l'angle d'une ligne
ShapeManager.prototype.calcAngleDegrees = function (x, y) {
    var radians = Math.atan2(y, x);
    if (radians < 0) {
        radians += 2 * Math.PI;
    }
    var degrees = radians * 180 / Math.PI;
    return degrees;
};

// UTILITAIRE : fonction qui permet de retrouver x à partir d'un angle et d'une longueur
ShapeManager.prototype.calcXByAngle = function (angle, distance, x) {
    x = Math.cos(angle * Math.PI / 180) * distance + x;
    return x;
};

// UTILITAIRE : fonction qui permet de retrouver y à partir d'un angle et d'une longueur
ShapeManager.prototype.calcYByAngle = function (angle, distance, y) {
    y = Math.sin(angle * Math.PI / 180) * distance + y;
    return y;
};

// LINE : Réalise un ajustement de l'angle de la forme (seulement sur la ligne)
// Implémentation : à coupler avec un checkShiftKey
ShapeManager.prototype.rotateShape = function (obj, cursor) {

    switch (obj.type) {

        case "line":
            var elt = document.getElementById(obj.id);
            var x = parseInt(elt.getAttributeNS(null, "x1"));
            var y = parseInt(elt.getAttributeNS(null, "y1"));
            var currentX = cursor.x;
            var currentY = cursor.y;
            var distanceX = currentX - x;
            var distanceY = currentY - y;
            var angle = this.calcAngleDegrees(x - currentX, y - currentY);

            if (angle > 112.5 && angle < 157.5) {
                // distanceX est toujours positive
                obj.x2 = this.calcXByAngle(315, distanceX, x);
                obj.y2 = this.calcYByAngle(315, distanceX, y);
            } else if (angle > 157.5 && angle < 202.5) {
                // distanceX est toujours positive
                obj.x2 = this.calcXByAngle(0, distanceX, x);
                obj.y2 = this.calcYByAngle(0, distanceX, y);
            } else if (angle > 202.5 && angle < 247.5) {
                // distanceX est toujours positive
                obj.x2 = this.calcXByAngle(45, distanceX, x);
                obj.y2 = this.calcYByAngle(45, distanceX, y);
            } else if (angle > 247.5 && angle < 292.5) {
                // distanceX peut être positive ou négative
                if (distanceX > 0) {
                    obj.x2 = x;
                    obj.y2 = this.calcYByAngle(90, distanceX, y) + distanceY;
                } else {
                    obj.x2 = x;
                    obj.y2 = this.calcYByAngle(270, distanceX, y) + distanceY;
                }
            } else if (angle > 292.5 && angle < 337.5) {
                // distanceX est toujours négative
                obj.x2 = this.calcXByAngle(315, distanceX, x);
                obj.y2 = this.calcYByAngle(315, distanceX, y);
            } else if ((angle > 337.5 && angle < 360) || (angle > 0 && angle < 22.5)) {
                // distanceX est toujours négative
                obj.x2 = this.calcXByAngle(0, distanceX, x);
                obj.y2 = this.calcYByAngle(0, distanceX, y);
            } else if (angle > 22.5 && angle < 67.5) {
                obj.x2 = this.calcXByAngle(45, distanceX, x);
                obj.y2 = this.calcYByAngle(45, distanceX, y);
            } else if (angle > 67.5 && angle < 112, 5) {
                // distanceX peut être positive ou négative
                if (distanceX > 0) {
                    obj.x2 = x;
                    obj.y2 = this.calcYByAngle(270, distanceX, y) + distanceY;
                } else {
                    obj.x2 = x;
                    obj.y2 = this.calcYByAngle(90, distanceX, y) + distanceY;
                }
            }
            break;

        case "default":
            console.log("Shape can't be rotated");
            break;

    }
    obj.x2 = Math.round(obj.x2);
    obj.y2 = Math.round(obj.y2);
    return obj;
};



// GLOBAL : Fonction qui transforme en objet un élément DOM transmis par l'id, pour persistance des données
ShapeManager.prototype.saveShape = function (id) {

    var elt = document.getElementById(id);

    switch (elt.getAttribute("data-type")) {

        case "rect":
            var shape = {};
            shape.type = elt.getAttribute("data-type");
            shape.percents = this.percToTab(elt.getAttribute("percents").toString());
            shape.fill = elt.getAttribute("fill");
            shape.stroke = elt.getAttribute("stroke");
            shape.strokeW = elt.getAttribute("stroke-width");
            break;

        case "line":
            var shape = {};
            shape.type = elt.getAttribute("data-type");
            shape.percents = this.percToTab(elt.getAttribute("percents").toString());
            shape.stroke = elt.getAttribute("stroke");
            shape.strokeW = elt.getAttribute("stroke-width");
            break;

        case "draw":
            var shape = {};
            shape.type = "draw";
            shape.percents = this.polyToTab(elt.getAttribute("percents"));
            shape.fill = elt.getAttribute("fill");
            shape.stroke = elt.getAttribute("stroke");
            shape.strokeW = elt.getAttribute("stroke-width");
            break;


        case "polyline":
            var shape = {};
            shape.type = elt.getAttribute("data-type");
            shape.percents = this.polyToTab(elt.getAttribute("percents"));
            shape.fill = elt.getAttribute("fill");
            shape.stroke = elt.getAttribute("stroke");
            shape.strokeW = elt.getAttribute("stroke-width");
            break;

        case "ellipse":
            var shape = {};
            shape.type = elt.getAttribute("data-type");
            shape.percents = this.percToTab(elt.getAttribute("percents").toString());
            shape.fill = elt.getAttribute("fill");
            shape.stroke = elt.getAttribute("stroke");
            shape.strokeW = elt.getAttribute("stroke-width");
            break;

        default:
            console.log("Shape Unknown");
            break;
    }
    return shape;
};



// GLOBAL : Fonction qui instancie une forme à partir d'un objet stocké en bdd
ShapeManager.prototype.loadShape = function (obj) {

    switch (obj.type) {

        case "rect":
            var shape = new Rect();
            shape.id = "rect" + ShapeManager.uid();
            shape.type = obj.type;
            shape.percents = obj.percents;
            shape.x = this.adjustCoord(this.container[0], shape.percents[0]);
            shape.y = this.adjustCoord(this.container[1], shape.percents[1]);
            shape.width = this.adjustCoord(this.container[0], shape.percents[2]);
            shape.height = this.adjustCoord(this.container[1], shape.percents[3]);
            shape.fill = obj.fill;
            shape.stroke = obj.stroke;
            shape.strokeW = obj.strokeW;
            break;

        case "line":
            var shape = new Line();
            shape.id = "line" + ShapeManager.uid();
            shape.type = obj.type;
            shape.percents = obj.percents;
            shape.x1 = this.adjustCoord(this.container[0], shape.percents[0]);
            shape.y1 = this.adjustCoord(this.container[1], shape.percents[1]);
            shape.x2 = this.adjustCoord(this.container[0], shape.percents[2]);
            shape.y2 = this.adjustCoord(this.container[1], shape.percents[3]);
            shape.stroke = obj.stroke;
            shape.strokeW = obj.strokeW;
            break;

        case "draw":
            var shape = new Polyline();
            shape.id = "draw" + ShapeManager.uid();
            shape.type = obj.type;

            shape.percents = "";
            shape.points = "";
            var percs = obj.percents;
            for (var i = 0; i < percs.length; i++) {
                var perc = percs[i];
                var point = this.adjustTabCoord(this.container[0], this.container[1], perc);
                shape.points += point + " ";
                shape.percents += perc + " ";
            }
            shape.fill = obj.fill;
            shape.stroke = obj.stroke;
            shape.strokeW = obj.strokeW;
            break;

        case "polyline":
            var shape = new Polyline();
            shape.id = "polyline" + ShapeManager.uid();
            shape.type = obj.type;
            shape.percents = "";
            shape.points = "";
            var percs = obj.percents;
            for (var i = 0; i < percs.length; i++) {
                var perc = percs[i];
                var point = this.adjustTabCoord(this.container[0], this.container[1], perc);
                shape.points += point + " ";
                shape.percents += perc + " ";
            }
            shape.fill = obj.fill;
            shape.stroke = obj.stroke;
            shape.strokeW = obj.strokeW;
            break;

        case "ellipse":
            var shape = new Ellipse();
            shape.id = "ellipse" + ShapeManager.uid();
            shape.type = obj.type;
            shape.percents = obj.percents;
            shape.cx = this.adjustCoord(this.container[0], shape.percents[0]);
            shape.cy = this.adjustCoord(this.container[1], shape.percents[1]);
            shape.rx = this.adjustCoord(this.container[0], shape.percents[2]);
            shape.ry = this.adjustCoord(this.container[1], shape.percents[3]);
            shape.fill = obj.fill;
            shape.stroke = obj.stroke;
            shape.strokeW = obj.strokeW;
            break;

        default:
            console.log("Shape Unknown");
            break;
    }
    return shape;
};



window.LibSvg.ShapeManager = ShapeManager;