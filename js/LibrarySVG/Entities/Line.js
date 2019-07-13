
// Line.js
// Constructeur de l'objet Line
function Line(id, type, x1, y1, x2, y2, percents, stroke, strokeW){
    
    this.id = id; 
    this.type = type; 
    this.x1 = x1; 
    this.y1 = y1; 
    this.x2 = x2; 
    this.y2 = y2; 
    this.percents = percents || [];
    this.stroke = stroke; 
    this.strokeW = strokeW;
}

window.LibSvg.Line = Line ;
