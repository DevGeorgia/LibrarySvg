
// Constructeur de l'objet Ellipse
function Ellipse(id, type, cx, cy, rx, ry, percents, fill, stroke, strokeW) {
    
  this.id = id; 
  this.type = type; 
  this.cx = cx; 
  this.cy = cy; 
  this.rx = rx; 
  this.ry = ry;
  this.percents = percents || [];
  // Fill est par défaut (transparent)
  this.fill = fill || "transparent"; 
  this.stroke = stroke;
  this.strokeW = strokeW;

}

window.LibSvg.Ellipse = Ellipse ;
