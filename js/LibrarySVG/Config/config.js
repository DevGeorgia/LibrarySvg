$(window).ready(function () {

    // Define the palette object to start the library
    paletteHtm = {
        // id of your shape buttons (! in your html buttons value should respect the Svg Name)
        btnShapes: "#btnRect, #btnLine, #btnPolyline, #btnDraw, #btnEllipse",
        // id of your select button
        btnSelect: "#btnSelect",
        // id of your delete button
        btnSuppr: "#btnSuppr",
        // id of your selector of stroke width
        selectSw: "#p-strokeW",
        // id of your colors button (! in your html the buttons value should be RGB or hexadecimal)
        btnColors: "#btnBlack, #btnGrey, #btnWhite, #btnYellow, #btnOrange, #btnRed, #btnPink, \n\
                    #btnPurple, #btnIndigo, #btnBlue, #btnSky, #btnMenthol, #btnGreen"
    };

    // Start the library
    // First arg : id of your svg container
    // Second arg : value of your button selection
    // Third arg : your palette object
    initLib("#mySvg", "selection", paletteHtm);
    
});
