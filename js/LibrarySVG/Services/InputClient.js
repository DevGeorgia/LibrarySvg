
function InputClient(containerId, svgElt, clickIsValid) {

    this.containerId = containerId;
    this.svgElt = svgElt;
    this.clickIsValid = clickIsValid || true;
    this.delay = 425;

}

/*** Récupère height et width de la fenêtre du user
 *   Et height width du conteneur SVG
 */

// Renvoie la hauteur de l'écran de l'user
InputClient.prototype.windowHeight = function() {
    var wH = window.screen.height;
    return wH;
};

// Renvoie la largeur de l'écran de l'user
InputClient.prototype.windowWidth = function() {
    var wW = window.screen.width;
    return wW;
};

// ! jQuery ! : Renvoie la hauteur du conteneur Svg de l'user
// argument de la fonction setY
InputClient.prototype.containerHeight = function() {
    var cH = $(this.containerId).height();
    return parseInt(cH);
};

// ! jQuery ! : Renvoie la largeur du conteneur Svg de l'user
// argument de la fonction setX
InputClient.prototype.containerWidth = function() {
    var cW = $(this.containerId).width();
    return parseInt(cW);
};

/*** 
 * Gestion de la position du curseur sur l'écran
 * 
 */

// Renvoie les coordonnées X de l'utilisateur à l'échelle du conteneur du SVG
InputClient.prototype.setX = function(event) {
    var coordPx = event.clientX - this.svgElt.getBoundingClientRect().left;
    return parseInt(coordPx);
};

// Renvoie les coordonnées Y de l'utilisateur à l'échelle du conteneur du SVG
InputClient.prototype.setY = function(event) {
    var coordPy =  event.clientY - this.svgElt.getBoundingClientRect().top;
    return parseInt(coordPy);
};


/*** 
 * Gestion du clavier
 * Pour faciliter la gestion des events Shift / Delete
 */


// Return true si la touche Shift est enfoncée
InputClient.prototype.checkShiftKey = function(e) {
    return e.shiftKey;
};


window.LibSvg.InputClient = InputClient ;