// Constructeur de l'objet Polyline
function Polyline(id, type, points, percents, fill, stroke, strokeW) {

    this.id = id; 
    this.type = type; 
    this.points = points; 
    this.percents = percents || [];
    // Fill est par défaut (transparent)
    this.fill = fill || "transparent"; 
    this.stroke = stroke; 
    this.strokeW = strokeW;

}

window.LibSvg.Polyline = Polyline ;
