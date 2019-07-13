
// Constructeur de l'objet Svg
function Svg(id, viewBox) {
    
    this.id = id; 
    this.type = "svg";
    // Fonctions seront mises à l'échelle de la fenêtre user
    this.viewBox = viewBox;
}

window.LibSvg.Svg = Svg ;
