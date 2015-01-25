$(document).ready(function () {
  
  // Preview screen stops working if this is moved to globals.js!
  var cc            = $('#canvasContainer');

/////////////////////
// Event listeners //
/////////////////////
  
  // Global mouse is to check for button presses on the palette, tools etc.
  $('body').mousedown(function(e){
    globalMouse = e.which;
  });

  
  // Mouse is on the move
  cc.mousemove(function(e){
    if (escPressed) {debugger;}
    hasMoved = true;
    if ( drawFlag ){ drawMove = true; }
    
    mousePos = getMousePos(e);
    updateMouseMoves();

    if ( magnifyOn ) {
      // Draw the pointer on the preview screen
      pointer( mousePos.pointerX, mousePos.pointerY, mousePos.x, mousePos.y, true, false );

      // Clear and update the preview screen
      updatePreviewScreen();

      // Write coordinates to the top bar.
      writeMessage();
    }
    
    if (clickNum != 0) { toolTypeSelected(); }
    if (clickNum == 2 && tool == 'line') { clickNum = 0; }

    if ( !magnifyOn ) {
      // Draw the pointer on the preview screen
      pointer( mousePos.pointerX, mousePos.pointerY, mousePos.x, mousePos.y, true, false );

      // Clear and update the preview screen
      updatePreviewScreen();

      // Write coordinates to the top bar.
      writeMessage();
    }
    update = true;
  });
  
  
  // Mouse button is down.
  cc.mousedown(function(e){
    hasMoved = false;
    mouseButton = e.which;
    dbb2 = mouseButton;
    var cmd;
    
    // Clear and update the preview screen
    updatePreviewScreen();
    
    /* Colourpicker not active - continue with clicks */
    if (! commaDown ) {
      clickNum++;
      updateClickBuffer();

      if (dbb2 == 3) { activeColour = colBG; }
      else { activeColour = colFG; }

      if (dbb2 != 2) { toolTypeSelected(); } else { clickNum--; }
    }
    writeMessage();
    update = true;
  });
  
  // Mouse button is released
  cc.mouseup(function(e){

    if ( commaDown && dbb2 != 2 ) {
      colour = getColour( mousePos.x, mousePos.y );
      setColour( colour );
      if (dbb2 == 1) { colourChanged = activeColour = colFG = colour; /* dbug( '//colFG: ' + colour ); */ }
      if (dbb2 == 3) { colourChanged = activeColour = colBG = colour; /* dbug( '//colBG: ' + colour ); */ }
      
      updatePaletteSelection();
    }
    
    if (tool == 'sketch' || tool == 'draw') {
      var t;
      if (tool == 'sketch') {t = 'sketch: '} else {t = 'draw  : '}
      clickNum = 0;
      if (coords) {
        saveToHistoryBuffer(t+startCoordColour+'|'+coords);
        lastCoordX = lastCoordY = startCoordColour = coords = null;
      }
    }
    
    if (hasMoved && clickNum == 2) {
      if (tool == 'curve') {clickNum++;}
      updateClickBuffer();
    }

    if (hasMoved && clickNum == 1) {
      // click-dragged and then released.
      if (tool == 'line' || tool == 'curve' || tool == 'rectangle' || tool == 'circle' || tool == 'ellipse') {clickNum++;}
      updateClickBuffer();
    }
    
    if (dbb2 == 2) {
      if (shiftDown) { redo(); } else { undo(); }
    }
    
    if (clickNum){ toolTypeSelected(); }
    
    // Clear and update the preview screen
    updatePreviewScreen();
    hasMoved = false;
    mouseButton = false;
  });
  

  function updateClickBuffer() {
    if (clickBuffer[clickNum]) {
      clickBuffer[clickNum].x = parseInt(mousePos.x);
      clickBuffer[clickNum].y = parseInt(mousePos.y);
    } else {
      clickBuffer.push ({ x: mousePos.x, y:mousePos.y });
    }
  }
  
  
  function updateMouseMoves() {
    dbx0 = dbx1; dbx1 = dbx2;
    dby0 = dby1; dby1 = dby2;

    if (clickNum != 3) {
      dbx2 = mousePos.x;
      dby2 = mousePos.y;
    }
  }
  
  
  // Get the mouse position
  function getMousePos(e) {
    $cc = document.getElementById('canvasContainer');
    var rect = $cc.getBoundingClientRect();
    x = Math.floor ( (e.clientX - rect.left - overscan) / pixelSize );
    y = Math.floor ( (e.clientY - rect.top - overscan) / pixelSize );
    magX = x;
    magY = y;
    
    if ( magnifyOn ) {
      if ( x > magStart ) {
        magX = ( ( magX - magStart ) / multiplier );
        magY = ( magY / multiplier);
        magX += magAdjustX;
        magY += magAdjustY;
      } else {
        magX += imgAdjustX;
        magY += imgAdjustY;
      }
    }
    
    return {
      pointerX: Math.floor ( x ),
      pointerY: Math.floor ( y ),
      x: Math.floor ( magX ),
      y: Math.floor ( magY )
    };
  }
  
  
/////////////////////////////////////
// Event handlers for tool buttons //
/////////////////////////////////////
  $('#saveBtn').click(function(){ saveImageAsPNG('MyImage.png') });
  
  $('.tool.ready').click(function() {
    $('.tool.ready').removeClass('active');
    $(this).addClass('active');
    tool = $(this).html();
  });
  
  $('.tool.ready.sub').mousedown(function(e){
    $('.tool.ready').removeClass('active');
    $('.tool.ready').removeClass('filled');
    filled = false;
    globalMouse = e.which;
    if (globalMouse == 3) {
      $(this).addClass('filled').addClass('active');
      tool = $(this).html();
      filled = true;
    }
  });
  
  // Clear
  $('.tool.clear').mousedown(function(e) {
    clearScreen(colBG);
    saveToHistoryBuffer('cls : '+colBG);
    update = true;
  });
  
  // Undo
  $('.tool.undo').mouseup(function(e) {
    globalMouse = e.which;
    if (globalMouse == 1) {
      undo();
    }
    if (globalMouse == 3) { 
      redo();
    }
  });
  
  
/////////////////////////////////
// Keyboard handlers for tools //
/////////////////////////////////
  $('body').keydown(function(e){

    // Do not use shortcuts if user is working with text input
    var el = document.activeElement;

    if (el && (el.tagName.toLowerCase() == 'input' && el.type == 'text' ||
        el.tagName.toLowerCase() == 'textarea')) {
      // focused element is a text input or textarea
      return;
    }
    
    var tempTool;
    var filler = filled;
    // Check Esc, Ctrl / Cmd, Shift, Comma and Alt keys
    if(e.which == 27){ if ( !escPressed ) { escPressed = true; } else { escPressed = false; } }
    if(e.which == 91 || e.which == 17){ ctrlCmdDown = true; }
    if(e.which == 16){ shiftDown = true; }
    if(e.which == 18){ altDown = true; }
    if(e.which == 188){ commaDown = true; }

    switch (e.which) {

      case 190: // .
        tempTool = 'sketch';
        //brush = false;
        break;
      
      case 83: // s
        tempTool = 'sketch';
        break;
      
      case 68: // d
        tempTool = 'draw';
        break;
      
      case 76: // l (used to be 'v' in Deluxe Paint)
        tempTool = 'line';
        break;
      
      case 77: // m
        if (magnifyOn) {
          clearMagnify();
          magnifyOn = false;
          update = true;
        } else {
          magnifyOn = true;
          magCenterX = dbx2;
          magCenterY = dby2;
          magnify();
        }
        break;
        
      case 78: // n
        magCenterX = dbx2;
        magCenterY = dby2;
        if (magnifyOn) { magnify(); }
        break;
        
      case 67: // c 
        tempTool = 'circle';
        if(shiftDown){ filler = true; } else { filler = false; }
        break;
      
      case 69: // e 
        tempTool = 'ellipse';
        if(shiftDown){ filler = true; } else { filler = false; }
        break;
      
      case 81: // q ('c' is for circle!)
        tempTool = 'curve';
        break;
      
      case 70: // f
        tempTool = 'fill';
        break;
        
      case 82: // r
        tempTool = 'rectangle';
        if(shiftDown){ filler = true; } else { filler = false; }
        break;
        
      case 85: // u
        if(shiftDown) { tempTool = 'redo'; } else { tempTool = 'undo'; }
        break;

      case 90: // z
        //tempTool = 'zoom';
        if(shiftDown && ctrlCmdDown) { undo(); /*tempTool = 'redo';*/ }
        if(ctrlCmdDown && !shiftDown){ redo(); /*tempTool = 'undo';*/ }
        break;
      
      case 75: // k
        clearScreen( colBG );
        saveToHistoryBuffer ( 'cls: ' + colBG );
        update = true;
        break;
        
      case 219: // å
        if ( !shiftDown ) {
          var newCol = colFG - 1;
          if ( newCol < 0 ) { newCol = frame[frameNum].pal.length - 1; }
          
          setColour( newCol );
          colourChanged = colFG = activeColour;
        } else {
          var newCol = colBG - 1;
          if ( newCol < 0 ) { newCol = frame[frameNum].pal.length - 1; }
          
          setColour( newCol );
          colourChanged = colBG = activeColour;
        }
        updatePaletteSelection();
        updatePreviewScreen();
        break;

      case 221: // ¨
        if ( !shiftDown ) {
          var newCol = colFG + 1;
          if ( newCol == frame[frameNum].pal.length ) { newCol = 0; }
          
          setColour( newCol );
          colourChanged = colFG = activeColour;

          //dbug( '//colFG: ' + newCol );
        } else {
          var newCol = colBG + 1;
          if ( newCol == frame[frameNum].pal.length ) { newCol = 0; }
          
          setColour( newCol );
          colourChanged = colBG = activeColour;
          
          //dbug( '//colBG: ' + newCol );
        }
        updatePaletteSelection();
        updatePreviewScreen();
        break;
        
        case 192: // < ( > with shift )
          if ( magnifyOn ) {
            if ( !shiftDown ) {
              multiplier--;
              if ( multiplier <= zoomLevel ) { multiplier = zoomLevel + 1; }
            } else {
              multiplier++;
              if ( multiplier > 16 ) { multiplier = 16; }
            }
          }
          break;
        
      default:
        console.log('//keydown: ' + e.which);
    }

    // Draw the pointer on the preview screen
    // (If we don't do it here, we can't see the colour change of the pixel!)
    pointer( mousePos.pointerX, mousePos.pointerY, mousePos.x, mousePos.y, true, false );

    // Clear and update the preview screen
    updatePreviewScreen();
    
    // Write coordinates to the top bar.
    writeMessage();
    
    if (tempTool) { updateTool( tempTool, filler ); }
    // updatePreviewScreen();
    
    update = true;
    
  });
  
  $('body').keyup(function(e){
    // Check Ctrl / Cmd, Shift and Alt keys
    if(e.which == 91 || e.which == 17){ ctrlCmdDown = false; }
    if(e.which == 16){ shiftDown = false; }
    if(e.which == 18){ altDown = false; }
    if(e.which == 188){ commaDown = false; }
    
    update = true;
  });
  
///////////////
// UI events //
///////////////
  $('.palIndex').mouseup(function (e){
    globalMouse = e.which;

    // Left mouse button
    if (globalMouse == 1) {
      colFG = parseInt($(this).text());
      activeColour = colFG;
      colourChanged = activeColour;
      
      updatePaletteSelection( colFG );
      
      $('#backgroundColour').removeClass('active');
    }

    // Right mouse button
    if (globalMouse == 3) {
      colBG = parseInt($(this).html());
      activeColour = colBG;
      colourChanged = activeColour;
      
      updatePaletteSelection( colFG );
      
      $('#foregroundColour').removeClass('active');
    }
    
  });
  
  
  // Applies the colour change to the current frame
  $('.applyChange').click( applyChange );
  $('.applySpread').click( function (){
    spreadColours();
    saveToHistoryBuffer('spread : ' + colFG + '-' + colBG );
  });
});

  function applyChange (){
    red = parseInt( $('#redVal').val() );
    green = parseInt( $('#greenVal').val() );
    blue = parseInt( $('#blueVal').val() );
    
    // Set the colour in the palette
    frame[frameNum].pal[colourChanged].r = red;
    frame[frameNum].pal[colourChanged].g = green;
    frame[frameNum].pal[colourChanged].b = blue;

    // Set the colour in the visible palette
    $('#palIndex'+colourChanged).css('background-color', $('#tempColour').css('background-color') );
    setColour( colourChanged );
    
    $('#backgroundColour.active').css( 'background-color', $('#tempColour').css('background-color') );
    $('#foregroundColour.active').css( 'background-color', $('#tempColour').css('background-color') );
    
    // Build a pixelbuffer of all pixels with this colour
    pixelBuffer = [];
    for (i = 0; i < frame[frameNum].pxl.length; i++) {
      if (frame[frameNum].pxl[i] == activeColour) {
        
        yPos = Math.floor(i / imgWidth);
        xPos = (i - yPos * imgWidth);

        pixelBuffer.push ({
          x: xPos,
          y: yPos
        });
      }
    }
    // Redraw pixels from the buffer with the new colour
    if (pixelBuffer) { pastePixelBuffer(); }
    saveToHistoryBuffer( 'newCol: ' + colourChanged + '|' + red + ',' + green + ',' + blue );
  };
  
