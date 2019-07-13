// Rect.js
// Constructeur de l'objet Rect
function Rect(id, type, x, y, width, height, percents, fill, stroke, strokeW) {

    this.id = id;
    this.type = type;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.percents = percents || [];
    // Fill est par défaut (transparent)
    this.fill = fill || "transparent";
    this.stroke = stroke;
    this.strokeW = strokeW;
    // les valeurs rx/ry pour le radius ne sont pas incluses dans cette version

  }

window.LibSvg.Rect = Rect ;
