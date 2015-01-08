var update        = false;

var zoomLevel     =   2;
var imgWidth      = 320;
var imgHeight     = 256;
var overscan      =  20;

var debug         = true;
var historyBuffer = [];
var historyStep   =  0;
var historyLimit  = 25;
var pixelBuffer   = [];
var coordBuffer   = [];
var coords;
var pixel         = [];         
var counter       =  0;
var brush         = false;
var brushBuffer   = [];

// Mouse
var globalMouse;
var clickBuffer   = [];
clickBuffer.push ({ x: 0, y:0 });
var clickNum      =  0;
var hasMoved      = false;
var mouseButton;              // holds the info about the mouse buttons
var click         = [];       // some operations calls for multiple clicks, like the curve.

// Keyboard
var escPressed    = false;
var shiftDown     = false;
var ctrlCmdDown   = false;

// Colour select
var colFG         =  1;       // Foreground colour
var colBG         =  0;       // Background colour
var activeColour  =  1;

// Tools
var tool          = 'draw';
var mode          = 'colour'; // Draw mode. Like colour, cycle, tint etc.
var filled        = false;
var rotation      =  0;
var preview       = true;

var currentFrame  =  0;
var frameNum      = currentFrame;
var frame         = [];
var palette       = [];

var dbx1, dby1, dbx2, dby2, dbb2;
