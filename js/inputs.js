$(document).ready(function () {
  
  // Preview screen stops working if this is moved to globals.js!
  var cv            = $('#preview');
  var cvOverlay     = $('#overlay');

/////////////////////
// Event listeners //
/////////////////////
  
  // Global mouse is to check for button presses on the palette, tools etc.
  $('body').mousedown(function(e){
    globalMouse = e.which;
  });

  
  // Mouse is on the move
  cv.mousemove(function(e){
    // console.log('mouse is on the move');
    hasMoved = true;
    
    var mousePos = getMousePos(e);
    updateMouseMoves(mousePos);

    // Clear the preview screen
    $prv.clearRect(0, 0, (imgWidth+overscan)*pixelSize, (imgHeight+overscan)*pixelSize);

    // Write coordinates to the info canvas.
    
    writeMessage();
    
    if (clickNum != 0) { toolTypeSelected(); }
    if (clickNum == 2 && tool == 'line') { clickNum = 0; }

    // Draw the pointer on the preview screen
    pointer(dbx2, dby2, true, false);
    
  });
  
  
  // Mouse button is down.
  cv.mousedown(function(e){
    hasMoved = false;
    mouseButton = e.which;
    dbb2 = mouseButton;
    var cmd;
    var mousePos = getMousePos(e);
    
    /* Colourpicker not active - continue with clicks */
    if (! commaDown ) {
      clickNum++;
      updateClickBuffer(mousePos);

      if (dbb2 == 3) { activeColour = colBG; }
      else { activeColour = colFG; }

      if (dbb2 != 2) { toolTypeSelected(); } else { clickNum--; }
    } else { cmd = 'Pick Colour '; }
    
    writeMessage( cmd );
  });
  
  
  // Mouse button is released
  cv.mouseup(function(e){
    var mousePos = getMousePos(e);
    
    if ( commaDown ) {
      colour = getColour( mousePos.x, mousePos.y );
      setColour( colour );
      if (dbb2 == 1) { activeColour = colFG = colour; dbug( '//colFG: ' + colour ); }
      if (dbb2 == 3) { activeColour = colBG = colour; dbug( '//colBG: ' + colour ); }
    }
    
    if (tool == 'sketch' || tool == 'draw') {
      var t;
      if (tool == 'sketch') {t = 'sketch: '} else {t = 'draw  : '}
      clickNum = 0;
      if (coords) {
        saveToHistoryBuffer(t+activeColour+'|'+coords);
        coords = '';
      }
    }
    
    if (hasMoved && clickNum == 2) {
      if (tool == 'curve') {clickNum++;}
      updateClickBuffer(mousePos);
    }

    if (hasMoved && clickNum == 1) {
      // click-dragged and then released.
      if (tool == 'line' || tool == 'curve' || tool == 'rectangle' || tool == 'circle' || tool == 'ellipse') {clickNum++;}
      updateClickBuffer(mousePos);
    }
    
    if (dbb2 == 2) {
      if (shiftDown) { redo(); } else { undo(); }
    }
    
    if (clickNum){ toolTypeSelected(); }
    
    hasMoved = false;
    mouseButton = false;
    
    writeMessage();
  });
  

  function updateClickBuffer(mousePos) {
    if (clickBuffer[clickNum]) {
      clickBuffer[clickNum].x = parseInt(mousePos.x);
      clickBuffer[clickNum].y = parseInt(mousePos.y);
    } else {
      clickBuffer.push ({ x: mousePos.x, y:mousePos.y });
    }
  }
  
  
  function updateMouseMoves(mousePos) {
    dbx0 = dbx1; dbx1 = dbx2;
    dby0 = dby1; dby1 = dby2;

    if (clickNum != 3) {
      dbx2 = mousePos.x;
      dby2 = mousePos.y;
    }
  }
  
  
  // Get the mouse position
  function getMousePos(e) {
    var rect = $c.getBoundingClientRect();
    tempX = parseInt((e.clientX - rect.left) / pixelSize);
    tempY = parseInt((e.clientY - rect.top) / pixelSize);
    return {
      x: tempX,
      y: tempY
    };
  }
  
  /////////////////////////////////////
  // Event handlers for tool buttons //
  /////////////////////////////////////
  $('#saveBtn').click(function(){ saveImageAsPNG('MyImage.png') });
  
  $('.tool.ready').click(function() {
    $('.tool.ready').removeClass('active');
    $(this).addClass('active')
    tool = $(this).html();
  });
  
  $('.tool.clear').mousedown(function(e) {
    globalMouse = e.which;
    if (globalMouse == 1) {
      clearScreen(colFG);
      
      // testing to see if this fixes the history problem.
      toolTypeSelected();

      saveToHistoryBuffer('cls : '+colFG);
      update = true;
    } 
    if (globalMouse == 3) { 
      clearScreen(colBG);
      
      // testing to see if this fixes the history problem.
      toolTypeSelected();

      saveToHistoryBuffer('cls : '+colBG);
      update = true;
    };
  });
  
  $('.tool.undo').mouseup(function(e) {
    globalMouse = e.which;
    if (globalMouse == 1) {
      undo();
    }
    if (globalMouse == 3) { 
      redo();
    }
  });
  
  // Keyboard handlers
  $('body').keydown(function(e){
    var tempTool;
    var filler = filled;
    // Check Esc, Ctrl / Cmd, Shift, Comma and Alt keys
    if(e.which == 27){ if ( !escPressed ) { escPressed = true; } else { escPressed = false; } }
    if(e.which == 91 || e.which == 17){ ctrlCmdDown = true; }
    if(e.which == 16){ shiftDown = true; }
    if(e.which == 18){ altDown = true; }
    if(e.which == 188){ commaDown = true; }

    switch (e.which) {
      case 83: // s
        tempTool = 'sketch';
        break;
      
      case 68: // d
        tempTool = 'draw';
        break;
      
      case 76: // l (used to be 'v' in Deluxe Paint)
        tempTool = 'line';
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
      
      case 219: // å
        var newCol = activeColour - 1;
        if ( newCol < 0 ) { newCol = frame[frameNum].pal.length - 1; }
        setColour( newCol );
        colFG = activeColour;
        dbug( '//colFG: ' + newCol );
        console.log ( 'å - ' + newCol );
        break;

      case 221: // ¨
        var newCol = activeColour + 1;
        if ( newCol == frame[frameNum].pal.length ) { newCol = 0; }
        setColour( newCol );
        colFG = activeColour;
        dbug( '//colFG: ' + newCol );
        console.log ('¨ - ' + newCol );
        break;

      default:
        console.log('//keydown: '+e.which);
    }
    
    if (tempTool) {
      updateTool(tempTool, filler);
      //dbug('//'+tempTool);
    }
  });
  
  $('body').keyup(function(e){
    // Check Ctrl / Cmd, Shift and Alt keys
    if(e.which == 91 || e.which == 17){ ctrlCmdDown = false; }
    if(e.which == 16){ shiftDown = false; }
    if(e.which == 18){ altDown = false; }
    if(e.which == 188){ commaDown = false; }
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
      
      var red = palIndex12to24bit(colFG).r;
      var green = palIndex12to24bit(colFG).g;
      var blue = palIndex12to24bit(colFG).b;

      $('.palIndex').css('border-color','black')
      $(this).css('border-color',$(this).css('background-color'));
      $('#foregroundColour').css('background-color','rgb('+red+','+green+','+blue+')').addClass('active');
      $('#backgroundColour').removeClass('active');

      updateTempColour();
      dbug('//colFG: '+colFG);
    }

    // Right mouse button
    if (globalMouse == 3) {
      colBG = parseInt($(this).html()); activeColour = colBG;

      var redBG = palIndex12to24bit(colBG).r;
      var greenBG = palIndex12to24bit(colBG).g;
      var blueBG = palIndex12to24bit(colBG).b;

      $('#backgroundColour').css('background-color','rgb('+redBG+','+greenBG+','+blueBG+')').addClass('active');
      $('#foregroundColour').removeClass('active');

      updateTempColour();
      dbug('//colBG: '+colBG);
    }
    colourChanged = activeColour;
    
    initRGBSliders ( colourChanged );
  });
  
  
  
  $('.applyChange').click( applyChange );
  
  function applyChange (e){
    //console.log ($('#palIndex'+colourChanged));
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
});
