function initLib(containerId, btnSelectionVal, paletteHtm) {

    /********* INITIALISATION DE LA LIBRARIE */

    // Etape 1 : Instanciation du SVGManager 
    var svgMan = new SvgManager();
    svgMan.containerId = containerId;

    // Etape 2 : Instanciation du InputClient
    var inputClient = new InputClient();
    inputClient.containerId = containerId;

    // Etape 3 : calcul les dimensions du conteneur SVG
    var containerW = inputClient.containerWidth();
    var containerH = inputClient.containerHeight();

    // Etape 4 : Instanciation du Svg et de la viewbox en fonction de la résolution du user
    objSvg = svgMan.initSvg();
    objSvg.viewBox = [0, 0, containerW, containerH];
    // Etape 5 : Ajout du SVG au DOM
    var svgElt = svgMan.svgToDom(objSvg);
    // (facultatif - etape 5.1) : variable SVG pour jQuery
    var svgEltSharp = "#" + svgElt;
    svgMan.svgId = svgEltSharp;

    // Etape 6 : Récupération de l'élément DOM SVG
    var svg = document.getElementById(svgElt);
    // Etape 7 : Stockage de l'élément SVG dans l'InputClient
    inputClient.svgElt = svg;

    // Etape 8 : Instanciation de la ShapePalette pour définir le style de la forme
    var palette = new ShapePalette();

    // Etape 9 : Instanciation de la ShapeManager pour générer la forme
    var shapeMan = new ShapeManager();
    shapeMan.container = [containerW, containerH];


    /********* GESTION DES EVENEMENTS */


    // Gestion du click pour resize ou sélectionner une forme
    $(svgEltSharp).click(
            function (event) {
                // Si la palette est en mode selection de forme
                if (palette.type === btnSelectionVal) {
                    // S'il ne s'agit pas d'un longclick
                    if (inputClient.clickIsValid) {

                        // récupérer la forme sélectionnée
                        var item = {};
                        item.id = event.target.id;
                        var elt = document.getElementById(item.id);
                        item.type = elt.getAttribute("data-type");

                        // Si ce n'est pas le svg, la stocker dans le ShapeManager
                        if (item.type !== "svg") {
                            shapeMan.item = item;
                        }

                        // Si la touche shift est enfoncée
                        if (event.shiftKey) {

                            // définir les coordonnées du curseur de l'utilisateur
                            var cursor = {
                                x: inputClient.setX(event),
                                y: inputClient.setY(event)
                            }

                            // récupérer la forme et la transformer en objet
                            var shape = shapeMan.getShape();
                            // la redimensionner
                            var newShape = shapeMan.resizeShape(shape, cursor);
                            // la renvoyer au SVG pour mettre à jour le DOM
                            svgMan.shapeToDom(newShape);
                        }
                    }
                }
            });


    // Gestion du dbclick pour stopper le polyline et reset le ShapeMan.item
    $(svgEltSharp).dblclick(
            function () {
                // Si la palette est en mode selection de forme
                if (palette.type !== btnSelectionVal) {
                    // récupérer la forme sélectionnée
                    var item = {};
                    shapeMan.item = item;
                    // récupérer l'objet de la forme
                    var shape = shapeMan.getShape();
                }
            });


    // Gestion du mousedown pour sélectionner ou créer une nouvelle forme
    $(svgEltSharp).mousedown(
            function (event) {
                // lancer le timer du longclick
                setTimeout(inputClient.clickIsValid = false, inputClient.delay);

                // Si la palette est en mode sélection de forme
                if (palette.type === btnSelectionVal) {

                    // récupérer la forme sélectionnée
                    var item = {};
                    item.id = event.target.id;
                    var elt = document.getElementById(item.id);
                    item.type = elt.getAttribute("data-type");

                    // Si ce n'est pas le svg, la stocker dans le shapeMan
                    if (item.type !== "svg") {
                        shapeMan.item = item;
                    }
                    // récupérer l'objet de la forme
                    var shape = shapeMan.getShape();
                    // la stocker dans le shapeMan
                    shapeMan.item = shape;

                    // Si l'on n'est pas en mode sélection de forme
                } else {

                    // définir les coordonnées du curseur de l'utilisateur
                    var cursor = {
                        x: inputClient.setX(event),
                        y: inputClient.setY(event)
                    }
                    // Si la forme sélectionnée est un polyline, on continue le tracé
                    if (shapeMan.item.id && shapeMan.item.type === "polyline") {
                        // récupérer l'objet de la forme
                        var shape = shapeMan.getShape();
                        // Sinon on crée une nouvelle forme
                    } else {
                        // Instancier une nouvelle forme (objet)
                        var shape = shapeMan.newShape(palette, cursor);
                        // l'envoyer dans le DOM (elt svg)
                        svgMan.newShapeToDom(shape);
                    }
                    // la stocker dans le shapeMan
                    shapeMan.item = shape;
                }
            });


    // Gestion du mousemove pour déplacer ou tracer la nouvelle forme
    $(svgEltSharp).mousemove(
            function (event) {

                // définir les coordonnées du curseur de l'utilisateur
                var cursor = {
                    x: inputClient.setX(event),
                    y: inputClient.setY(event)
                };

                // Si longclick
                if (!inputClient.clickIsValid) {
                    // Si palette en mode selection de forme
                    if (palette.type === btnSelectionVal) {
                        // Si un item est stocké dans le shape factor et que ce n'est pas un polyline
                        if (shapeMan.item) {
                            // récupérer l'objet de la forme
                            var shape = shapeMan.getShape();
                            // déplacer la forme
                            var newShape = shapeMan.moveShape(shape, cursor);
                            // Stocker la nouvelle forme dans le shapeMan
                            shapeMan.item = newShape;
                            // l'envoyer vers le DOM
                            svgMan.shapeToDom(newShape);
                        }
                        // Si l'on est en mode création de forme
                    } else {
                        // Récupérer l'item stocké dans le shape factory
                        if (shapeMan.item) {
                            // récupérer l'objet de la forme
                            var shape = shapeMan.getShape();
                            // Si shift enfoncé et que l'objet est une ligne
                            if (event.shiftKey && shapeMan.item.type === "line") {
                                // Verrouiller la rotation
                                var newShape = shapeMan.rotateShape(shape, cursor);
                                // Stocker la nouvelle forme dans le shapeMan
                                shapeMan.item = newShape;
                                // renvoyer les modifications vers le DOM
                                svgMan.shapeToDom(newShape);
                                // Si shift non enfoncé
                            } else {
                                // définir les nouvelles valeurs de l'objet de la forme
                                var newShape = shapeMan.traceShape(shape, cursor);
                                // Stocker la nouvelle forme dans le shapeMan
                                shapeMan.item = newShape;
                                // La renvoyer au DOM = traçage
                                svgMan.shapeToDom(newShape);
                            }
                        }
                    }
                }
            });


    // Gestion du mouseup pour stopper le longclick
    $(svgEltSharp).mouseup(
            function () {
                // Si longclick
                if (!inputClient.clickIsValid) {
                    // Remise à zero du timer longclick
                    clearTimeout(inputClient.clickIsValid = false);
                    if (palette.type !== btnSelectionVal) {
                        if (shapeMan.item.type === "polyline") {
                            // récupérer l'objet de la forme
                            var shape = shapeMan.getShape();
                            // continuer le tracé
                            svgMan.continueToDom(shape);
                        }
                    }
                }
                // Repassage du click à true (valeur par défaut)
                inputClient.clickIsValid = true;
            });


    /*** A ADAPTER SELON L'INTERFACE */

    // PALETTE : Gestion du clic pour sélectionner la forme
    $(paletteHtm.btnShapes).click(
            function () {
                var val = $(this).attr("value");
                palette.type = val;
                shapeMan.item = "";
            });

    $(paletteHtm.btnSelect).click(
            function () {
                var val = $(this).attr("value");
                palette.type = val;
                shapeMan.item = "";
            });

    // PALETTE : Gestion du clic pour supprimer la forme
    $(paletteHtm.btnSuppr).click(
            function () {
                var shape = shapeMan.getShape();
                svgMan.deleteShape(shape, svg);
                shapeMan.item = "";
            });

    // PALETTE : Gestion du clic pour sélectionner la couleur de la forme
    $(paletteHtm.btnColors).click(
            function () {
                var val = $(this).attr("value");
                palette.stroke = val;
                if (shapeMan.item) {
                    if (shapeMan.item && shapeMan.item.type !== "svg") {
                        // récupérer l'objet de la forme
                        var shape = shapeMan.getShape();
                        // changer la couleur
                        shape.stroke = palette.stroke;
                        // La renvoyer au DOM = traçage
                        svgMan.shapeToDom(shape);
                    }
                }
            });

    // PALETTE : Gestion du clic sur le select de l'épaisseur de la forme
    $(paletteHtm.selectSw).change(
            function () {
                var val = $(this).val();
                palette.strokeW = val;
                if (shapeMan.item) {
                    if (shapeMan.item && shapeMan.item.type !== "svg") {
                        // récupérer l'objet de la forme
                        var shape = shapeMan.getShape();
                        // changer la couleur
                        shape.strokeW = palette.strokeW;
                        // La renvoyer au DOM = traçage
                        svgMan.shapeToDom(shape);
                    }
                }
            });
}


/*** Fonctions utilitaires pour la persistance des données */

function saveTemplate(svgId) {
    var template = [];
    $(svgId).children().each(function () {
        var id = $(this).attr("id");
        var shapeMan = new ShapeManager();
        var shape = shapeMan.saveShape(id);
        template.push(shape);
    });
    return template;
}

function loadTemplate(containerId, svgId, template) {
    var containerW = parseInt($(containerId).width());
    var containerH = parseInt($(containerId).height());
    var shapeMan = new ShapeManager();
    shapeMan.container = [containerW, containerH];
    var svgMan = new SvgManager();
    svgMan.svgId = svgId;

    $(svgId).html("");
    var modele = JSON.parse(template);
    for (var i = 0; i < modele.length; i++) {
        var obj = modele[i];
        var shape = shapeMan.loadShape(obj);
        if (shape) {
            svgMan.newShapeToDom(shape);
        }
    }   
}


window.LibSvg = {};
window.LibSvg.initLib = initLib;