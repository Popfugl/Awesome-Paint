/////////////////////////////////////////////////////
// Remember to:                                    //
//                                                 //
// update() to the screen on change.               //
// saveToHistoryBuffer(cmd) after each new tool    //
// and do this in functions and not at the end of  //
// the tool function.                              //
//                                                 //
/////////////////////////////////////////////////////

var update        = false;

// screen
var zoomLevel       =   2;
var imgWidth        = 320;
var imgHeight       = 256;
var imgPixelWidth;
var imgPixelHeight;
var overscan        =  20;

// magnify
var magnifyOn       = false;
var splitscreen     = 1;
var multiplier      = zoomLevel + 3;
var magAdjustX, magAdjustY, imgAdjustX, imgAdjustY;
var magCenterX, magCenterY;
var magPosX;
var magStart;

var debug         = true;

// History
var historyBuffer = [];
var historyStep   = null;
var historyLimit  = 25;

// Command History
var commandBuffer = [];
var coordBuffer   = [];
var coords;
var startCoordColour;
var lastCoordColour    =  1; // used to see if the colour has changed since last coordinate.
var lastCoordX;
var lastCoordY;

var pixel         = [];         
var pixelBuffer   = [];
var counter       =  0;
var brush         = false;
var brushBuffer   = [];
var drawFlag = false;
var drawMove;

// Mouse
var globalMouse;
var mousePos;
var clickBuffer   = [];
clickBuffer.push ({ x: 0, y:0 });
var clickNum      =  0;
var hasMoved      = false;
var mouseButton;                  // holds the info about the mouse buttons
var click         = [];           // some operations calls for multiple clicks, like the curve.
var pointerFlag;                  // for when setPixel draws the pointer to a different canvas than normal.
var previewSpecial;

// Keyboard
var escPressed    = false;
var shiftDown     = false;
var commaDown     = false;
var ctrlCmdDown   = false;

// Colour select
var colFG         =  1; // Foreground colour
var colBG         =  0; // Background colour
var activeColour  =  1;
var colourChanged =  1;

// Tools
var tool          = 'draw';
var mode          = 'colour'; // Draw mode. Like colour, cycle, tint etc.
var filled        = false;
var rotation      =  0;
var preview       = true;

var currentFrame  =  0;
var frameNum      = currentFrame;
var frame         = [];

var dbx1 = 0, dby1 = 0, dbx2 = 0, dby2 = 0, dbb2;
