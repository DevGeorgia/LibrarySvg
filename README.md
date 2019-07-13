# LibrarySvg

This library was the principal part of my traineeship. My mission was to create a library Svg for my company's application. This library is used in a collaborative worklow module and enables to add some drawings on a document with comments (comments are part of back end and are not managed in this repo) before validate or reject a document and pass it to another user.

The library use JavaScript and jQuery only.

There's an html example in this repo named "sample.html", but you can of course use another after some configurations.

## Configuration

Tu use the library you just have to set up the config.js file.

### Shapes supported

This Svg Library only supports : Rect, Line, Ellipse, Polyline

### Svg Configuration

The entry point is the function : initLib(arg1, arg2, arg3);
Where :
* arg1 is the id of your svg container
* arg2 is the value of your button selection
* arg3 is your palette object (defined below)

### Palette Configuration

The most "difficult" part is to configure the drawing palette. I made one by default in the htlm example but in reality you can personnalize it and adding more colors to your palette (In my case I sticked to my specifications).

The palette object depends totally on your html palette, you have to be carefull to the buttons id's and their value.

Your palette has 5 attributes which contains ids.

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

The shapes and colors in your html palette need values. You can see an example in the sample.html

## Methods

The lib.js file regroup all the use cases.

With this library, you can :
* Create shapes with color or stroke you decide
* Move them with the selection button
* Delete them with the delete button
* Adjust them (Rect and Ellipse) with clic+shift (Rect become a Square and Ellipse become a Circle)
* Rotate a line with clic+shift

