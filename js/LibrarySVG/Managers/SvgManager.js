
var nextId = 0;

function SvgManager(containerId, svgId) {
    this.containerId = containerId;
    this.svgId = svgId;
    this.xmlns = "http://www.w3.org/2000/svg";
}

SvgManager.uid = function ()
{
    return ++nextId;
};

/**** GESTION DE L'ELEMENT SVG ****/

// Si pas de SVG existant instancier un nouveau
SvgManager.prototype.initSvg = function () {
    var svg = new Svg();
    svg.id = "svg" + SvgManager.uid();
    return svg;
};

// Transforme la viewBox[] en string pour implémentation html
SvgManager.prototype.vbToString = function (vb) {
    var s = "";
    for (var i = 0; i < vb.length; i++) {
        var s = s + " " + vb[i];
    }
    return s.trim();
};

// Ajoute l'objet SVG au DOM
SvgManager.prototype.svgToDom = function (obj) {
    var svg = document.createElementNS(this.xmlns, "svg");
    svg.setAttribute("id", obj.id);
    svg.setAttribute("viewBox", this.vbToString(obj.viewBox));
    $(this.containerId).append(svg);
    return obj.id;
};


/**** GESTION DU MOUVEMENT DES FORMES DANS LE SVG ****/


// Fonction qui crée la forme dans le DOM à partir de l'id du SVG Conteneur
SvgManager.prototype.newShapeToDom = function (shape) {

    switch (shape.type) {
        case "rect":
            var rect = document.createElementNS(this.xmlns, "rect");
            rect.setAttribute("id", shape.id);
            rect.setAttribute("data-type", shape.type);
            rect.setAttribute("x", shape.x);
            rect.setAttribute("y", shape.y);
            rect.setAttribute("width", shape.width);
            rect.setAttribute("height", shape.height);
            rect.setAttribute("percents", shape.percents);
            rect.setAttribute("fill", shape.fill);
            rect.setAttribute("stroke", shape.stroke);
            rect.setAttribute("stroke-width", shape.strokeW);
            $(this.svgId).append(rect);
            break;

        case "ellipse":
            var ellipse = document.createElementNS(this.xmlns, "ellipse");
            ellipse.setAttribute("id", shape.id);
            ellipse.setAttribute("data-type", shape.type);
            ellipse.setAttribute("cx", shape.cx);
            ellipse.setAttribute("cy", shape.cy);
            ellipse.setAttribute("rx", shape.rx);
            ellipse.setAttribute("ry", shape.ry);
            ellipse.setAttribute("percents", shape.percents);
            ellipse.setAttribute("fill", shape.fill);
            ellipse.setAttribute("stroke", shape.stroke);
            ellipse.setAttribute("stroke-width", shape.strokeW);
            $(this.svgId).append(ellipse);
            break;

        case "line":
            var line = document.createElementNS(this.xmlns, "line");
            line.setAttribute("id", shape.id);
            line.setAttribute("data-type", shape.type);
            line.setAttribute("x1", shape.x1);
            line.setAttribute("y1", shape.y1);
            line.setAttribute("x2", shape.x2);
            line.setAttribute("y2", shape.y2);
            line.setAttribute("percents", shape.percents);
            line.setAttribute("stroke", shape.stroke);
            line.setAttribute("stroke-width", shape.strokeW);
            $(this.svgId).append(line);
            break;

        case "polyline":
            var polyline = document.createElementNS(this.xmlns, "polyline");
            polyline.setAttribute("id", shape.id);
            polyline.setAttribute("data-type", shape.type);
            polyline.setAttribute("points", shape.points);
            polyline.setAttribute("percents", shape.percents);
            polyline.setAttribute("stacks", 0);
            polyline.setAttribute("fill", shape.fill);
            polyline.setAttribute("stroke", shape.stroke);
            polyline.setAttribute("stroke-width", shape.strokeW);
            $(this.svgId).append(polyline);
            break;

        case "draw":
            var draw = document.createElementNS(this.xmlns, "polyline");
            draw.setAttribute("id", shape.id);
            draw.setAttribute("data-type", shape.type);
            draw.setAttribute("points", shape.points);
            draw.setAttribute("percents", shape.percents);
            draw.setAttribute("fill", shape.fill);
            draw.setAttribute("stroke", shape.stroke);
            draw.setAttribute("stroke-width", shape.strokeW);
            $(this.svgId).append(draw);
            break;

        default:
            console.log("Shape Unknown");
            break;
    }
    return shape;
};


// Fonction qui modifie une forme existante dans le DOM
SvgManager.prototype.shapeToDom = function (shape) {

    switch (shape.type) {
        case "rect":
            var rect = document.getElementById(shape.id);
            rect.setAttribute("id", shape.id);
            rect.setAttribute("data-type", shape.type);
            rect.setAttribute("x", shape.x);
            rect.setAttribute("y", shape.y);
            rect.setAttribute("width", shape.width);
            rect.setAttribute("height", shape.height);
            rect.setAttribute("percents", shape.percents);
            rect.setAttribute("fill", shape.fill);
            rect.setAttribute("stroke", shape.stroke);
            rect.setAttribute("stroke-width", shape.strokeW);
            break;

        case "ellipse":
            var ellipse = document.getElementById(shape.id);
            ellipse.setAttribute("id", shape.id);
            ellipse.setAttribute("data-type", shape.type);
            ellipse.setAttribute("cx", shape.cx);
            ellipse.setAttribute("cy", shape.cy);
            ellipse.setAttribute("rx", shape.rx);
            ellipse.setAttribute("ry", shape.ry);
            ellipse.setAttribute("percents", shape.percents);
            ellipse.setAttribute("fill", shape.fill);
            ellipse.setAttribute("stroke", shape.stroke);
            ellipse.setAttribute("stroke-width", shape.strokeW);
            break;

        case "line":
            var line = document.getElementById(shape.id);
            line.setAttribute("id", shape.id);
            line.setAttribute("data-type", shape.type);
            line.setAttribute("x1", shape.x1);
            line.setAttribute("y1", shape.y1);
            line.setAttribute("x2", shape.x2);
            line.setAttribute("y2", shape.y2);
            line.setAttribute("percents", shape.percents);
            line.setAttribute("stroke", shape.stroke);
            line.setAttribute("stroke-width", shape.strokeW);
            break;

        case "draw":
            var draw = document.getElementById(shape.id);
            draw.setAttribute("id", shape.id);
            draw.setAttribute("data-type", shape.type);
            draw.setAttribute("points", shape.points);
            draw.setAttribute("percents", shape.percents);
            draw.setAttribute("stroke", shape.stroke);
            draw.setAttribute("stroke-width", shape.strokeW);
            break;

        case "polyline":
            var polyline = document.getElementById(shape.id);
            polyline.setAttribute("id", shape.id);
            polyline.setAttribute("data-type", shape.type);
            polyline.setAttribute("points", shape.points);
            polyline.setAttribute("percents", shape.percents);
            polyline.setAttribute("stroke", shape.stroke);
            polyline.setAttribute("stroke-width", shape.strokeW);
            break;

        default:
            console.log("Shape Unknown");
            break;
    }
};


// Fonction qui modifie une forme existante dans le DOM
SvgManager.prototype.continueToDom = function (shape) {

    switch (shape.type) {

        case "polyline":
            var polyline = document.getElementById(shape.id);
            var eltGetStacks = parseInt(polyline.getAttribute("stacks"));
            var stacks = eltGetStacks + 1;
            polyline.setAttribute("stacks", stacks);
            break;

        default:
            console.log("This shape can't continue");
            break;
    }
};



// Méthode qui supprime la forme 
// Implémentation : à coupler avec un un suppr keyboard ?
// A simplifier si pas de custom selon la forme sélectionnée
SvgManager.prototype.deleteShape = function (obj, svg) {

    var elt = document.getElementById(obj.id);

    switch (obj.type) {
        case "rect":
            svg.removeChild(elt);
            break;

        case "ellipse":
            svg.removeChild(elt);
            break;

        case "line":
            svg.removeChild(elt);
            break;

        case "polyline":
            svg.removeChild(elt);
            break;

        case "draw":
            svg.removeChild(elt);
            break;

        case "default":
            console.log("No shape selected");
            break;
    }
};


window.LibSvg.SvgManager = SvgManager;