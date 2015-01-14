function toolTypeSelected() {
  
  if (historyStep != null){
    deleteFutureHistory(historyStep+1);
    historyStep = null;
  }
  
  // Draw and Sketch ends at mouseup and the history state is saved there (in inputs.js)
  if (tool == 'sketch') { sketch( dbx2, dby2, mode, brush, false ); }
  if (tool == 'draw')   {
    if ( clickNum == 1 && !hasMoved) {
      sketch( dbx2, dby2, mode, brush, false );
    } else {
      draw( dbx1, dby1, dbx2, dby2, mode, brush, false );
    }
  }
  if (tool == 'sketch' || tool == 'draw') {
    clickNum = 1;
    return;
  }
  
  if (clickNum == 1) {
    // ends here
    if (tool == 'fill') {
      floodFill( activeColour, dbx2, dby2 );
      clickNum = 0;
      
      // Testing - should fix history buffer problem.
      toolTypeSelected();

      saveToHistoryBuffer('fill  : '+activeColour+'|'+dbx2+','+dby2);
    }
    
    // not quite done yet
    if (tool == 'line' || tool == 'curve') {
      drawLine( clickBuffer[1].x, clickBuffer[1].y, dbx2, dby2, mode, brush, true );
    }
    if (tool == 'rectangle') { rectangle( clickBuffer[1].x, clickBuffer[1].y, dbx2, dby2, filled, rotation, mode, brush, true ); }
    if (tool == 'circle') { circle( clickBuffer[1].x, clickBuffer[1].y, dbx2, dby2, filled, mode, brush, true ); }
    if (tool == 'ellipse') { ellipse( clickBuffer[1].x, clickBuffer[1].y, dbx2, dby2, filled, 0, mode, brush, true ); }
    
  }
                                                      
  if (clickNum == 2) {
    // ends here
    if (tool == 'line') {
      drawLine( clickBuffer[1].x, clickBuffer[1].y, clickBuffer[2].x, clickBuffer[2].y, mode, brush, false );
      clickNum = 0;
      saveToHistoryBuffer('line  : '+activeColour+'|'+clickBuffer[1].x+','+clickBuffer[1].y+','+clickBuffer[2].x+','+clickBuffer[2].y);
    }
    
    if (tool == 'rectangle') {
      rectangle(clickBuffer[1].x, clickBuffer[1].y, clickBuffer[2].x, clickBuffer[2].y, filled, rotation, mode, brush, false );
      clickNum = 0;
      saveToHistoryBuffer('rect  : '+activeColour+'|'+clickBuffer[1].x+','+clickBuffer[1].y+','+clickBuffer[2].x+','+clickBuffer[2].y+','+filled);
    }
    
    if (tool == 'circle') {
      circle( clickBuffer[1].x, clickBuffer[1].y, clickBuffer[2].x, clickBuffer[2].y, filled, mode, brush, false );
      clickNum = 0;
      saveToHistoryBuffer('circle: '+activeColour+'|'+clickBuffer[1].x+','+clickBuffer[1].y+','+clickBuffer[2].x+','+clickBuffer[2].y+','+filled);
    }
    
    if (tool == 'ellipse') {
      ellipse( clickBuffer[1].x, clickBuffer[1].y, clickBuffer[2].x, clickBuffer[2].y, filled, mode, brush, false );
      clickNum = 0;
      saveToHistoryBuffer('ellipse: '+activeColour+'|'+clickBuffer[1].x+','+clickBuffer[1].y+','+clickBuffer[2].x+','+clickBuffer[2].y+','+filled);
    }
    
    // not quite done yet
    if (tool == 'curve') { curve( clickBuffer[1].x, clickBuffer[1].y, clickBuffer[2].x, clickBuffer[2].y, dbx2, dby2, mode, brush, true ); }
  }
    
  if (clickNum == 3) {
    // ends here
    if (tool == 'curve') {
      curve( clickBuffer[1].x, clickBuffer[1].y, clickBuffer[2].x, clickBuffer[2].y, clickBuffer[3].x, clickBuffer[3].y, mode, 0, false );
      clickNum = 0;
      saveToHistoryBuffer('curve : '+activeColour+'|'+clickBuffer[1].x+','+clickBuffer[1].y+','+clickBuffer[2].x+','+clickBuffer[2].y+','+clickBuffer[3].x+','+clickBuffer[3].y);
    }
  }
}

// When the tool is changed (usually by keyboard press)
function updateTool( tempTool, fill ){
  if ($('#'+tempTool+'.ready')) {
    $('.tool').removeClass('filled');
    $('.tool').removeClass('active');
    $('#'+tempTool).click();
    filled = fill;
    if (fill) {$('#'+tempTool).addClass('filled');}
  }
  if (tempTool == 'undo'){ undo(); }
  if (tempTool == 'redo'){ redo(); }
}

// write coordinates and message to the top bar
function writeMessage(message, x, y, degrees) {
  if ( x == null ) { x = dbx2; y = dby2; }
  if ( message == null ) { message = ''; }
  if ( commaDown ) { message = 'Pick Colour'; }
                    
  var col = getColour( dbx2, dby2, currentFrame );
  if (col != null) {
    col24 = palIndex12to24bit( col );
    $('#hoverCol').css('background-color', 'rgba('+col24.r+','+col24.g+','+col24.b+','+col24.a+')' );
    message = '#' + col + ' ' + message;
  }
  if (!degrees){ x += '<span class="arrow">→</span>'; y += '<span class="arrow">↓</span>'; }
  else { x += '<span class="arrow">r:</span>'; y += '<span class="arrow">&nbsp;</span>'; }
  $('#info').html( message );
  $('#coordX').html(x);
  $('#coordY').html(y);
}

function saveImageAsPNG (saveImageName){
  // draw to canvas...
  saveCanvas = document.getElementById('tempCanvas');
  saveCanvas.toBlob(function(blob) { saveAs(blob, name); });
}


function dbug( log ) {
  console.log(log);
  var op = $('#output');
  var h = 1000000000000; // Since .scrollHeight doesn't seem to work with jQuery, and as I only want to scroll to the bottom, this should be sufficient.
  op.text( op.text() + log + '\n' );
  op.scrollTop( h );
}


function addFrame(index) {
  dbug('addFrame: '+index);
  var pal = [];
  frame.push ({
    index: index,
    pal: pal,
    pxl: pixel.slice(0),
    timing: 1000/24
  });
}

function getLength( X0, Y0, X1, Y1 ) {
  var lX, lY, dX, dY;
  lX = X1-X0;
  lY = Y1-Y0;
  if (lX < 0) { dX = -1 } else { dX = 1; }
  if (lY < 0) { dY = -1 } else { dY = 1; }
  
  return {
    lenX: X1-X0,
    lenY: Y1-Y0,
    dirX: dX,
    dirY: dY
  }
}

function pointer(cx, cy, preview, brush) {
  if (!brush && !clickNum && !commaDown) { setPixel( colFG, cx, cy, 0, 0, preview); }
  setPixel(17, cx+7, cy, 0, 0, preview);
  setPixel(18, cx+6, cy, 0, 0, preview);
  setPixel(17, cx+5, cy, 0, 0, preview);
  setPixel(18, cx+4, cy, 0, 0, preview);
  setPixel(17, cx+3, cy, 0, 0, preview);
  setPixel(18, cx+2, cy, 0, 0, preview);

  setPixel(17, cx-7, cy, 0, 0, preview);
  setPixel(18, cx-6, cy, 0, 0, preview);
  setPixel(17, cx-5, cy, 0, 0, preview);
  setPixel(18, cx-4, cy, 0, 0, preview);
  setPixel(17, cx-3, cy, 0, 0, preview);
  setPixel(18, cx-2, cy, 0, 0, preview);

  setPixel(17, cx, cy+7, 0, 0, preview);
  setPixel(18, cx, cy+6, 0, 0, preview);
  setPixel(17, cx, cy+5, 0, 0, preview);
  setPixel(18, cx, cy+4, 0, 0, preview);
  setPixel(17, cx, cy+3, 0, 0, preview);
  setPixel(18, cx, cy+2, 0, 0, preview);

  setPixel(17, cx, cy-7, 0, 0, preview);
  setPixel(18, cx, cy-6, 0, 0, preview);
  setPixel(17, cx, cy-5, 0, 0, preview);
  setPixel(18, cx, cy-4, 0, 0, preview);
  setPixel(17, cx, cy-3, 0, 0, preview);
  setPixel(18, cx, cy-2, 0, 0, preview);
}