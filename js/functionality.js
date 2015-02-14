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
    if ( !startCoordColour ) { startCoordColour = activeColour; }
    clickNum = 1;
    return;
  }
  
  if (clickNum == 1) {
    // ends here
    if (tool == 'fill') {
      var flag = floodFill( activeColour, dbx2, dby2 );
      clickNum = 0;
      
      // Testing - should fix history buffer problem.
      // toolTypeSelected();

      if ( flag ){ saveToHistoryBuffer('fill  : '+activeColour+'|'+dbx2+','+dby2); }
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
      saveToHistoryBuffer('line  : '+activeColour+'|'+clickBuffer[1].x+','+clickBuffer[1].y+';'+clickBuffer[2].x+','+clickBuffer[2].y);
    }
    
    if (tool == 'rectangle') {
      rectangle(clickBuffer[1].x, clickBuffer[1].y, clickBuffer[2].x, clickBuffer[2].y, filled, rotation, mode, brush, false );
      clickNum = 0;
      saveToHistoryBuffer('rect  : '+activeColour+'|'+clickBuffer[1].x+','+clickBuffer[1].y+';'+clickBuffer[2].x+','+clickBuffer[2].y+','+filled);
    }
    
    if (tool == 'circle') {
      circle( clickBuffer[1].x, clickBuffer[1].y, clickBuffer[2].x, clickBuffer[2].y, filled, mode, brush, false );
      clickNum = 0;
      saveToHistoryBuffer('circle: '+activeColour+'|'+clickBuffer[1].x+','+clickBuffer[1].y+';'+clickBuffer[2].x+','+clickBuffer[2].y+','+filled);
    }
    
    if (tool == 'ellipse') {
      ellipse( clickBuffer[1].x, clickBuffer[1].y, clickBuffer[2].x, clickBuffer[2].y, filled, mode, brush, false );
      clickNum = 0;
      saveToHistoryBuffer('ellipse: '+activeColour+'|'+clickBuffer[1].x+','+clickBuffer[1].y+';'+clickBuffer[2].x+','+clickBuffer[2].y+','+filled);
    }
    
    // not quite done yet
    if (tool == 'curve') { curve( clickBuffer[1].x, clickBuffer[1].y, clickBuffer[2].x, clickBuffer[2].y, dbx2, dby2, mode, brush, true ); }
  }
    
  if (clickNum == 3) {
    // ends here
    if (tool == 'curve') {
      curve( clickBuffer[1].x, clickBuffer[1].y, clickBuffer[2].x, clickBuffer[2].y, clickBuffer[3].x, clickBuffer[3].y, mode, 0, false );
      clickNum = 0;
      saveToHistoryBuffer( 'curve : ' + activeColour + '|' + clickBuffer[1].x + ',' + clickBuffer[1].y + ';' + clickBuffer[2].x + ',' + clickBuffer[2].y + ';' + clickBuffer[3].x + ',' + clickBuffer[3].y );
    }
  }
  
  lastCoordX = dbx2;
  lastCoordY = dby2;
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
    $('#hoverCol').css( 'background-color', 'rgba( ' + col24.r + ',' + col24.g + ',' + col24.b + ',' + col24.a + ')' );
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
  saveCanvas = document.getElementById('imageTempCanvas');
  saveCanvas.toBlob(function(blob) { saveAs(blob, name); });
}

function dbug( log ) {
  var redoCheck = log.replace( 'redo','');
  if ( redoCheck == log ){ commandBuffer.push( log ); } else { commandBuffer.pop(); }

  var text = '';
  var op = $('#output');
  var h = 100000000000; // Since .scrollHeight doesn't seem to work with jQuery, and as I only want to scroll to the bottom, this should be sufficient.
  for ( i = 0; i < commandBuffer.length; i++ ){
    text += '<div id="cmdHis' + i + '" ondblclick="pch(' + i + ')">' + commandBuffer[i] + '</div>'
  }
  op.html( text+'<br />' );
  op.scrollTop( h );
}

function pch(num, prv){
  var txt = $('#cmdHis' + num).text();
  parseCommandHistory(txt);
};

function addFrame(index) {
  if ( commandBuffer[1] ){ dbug('addFrame: '+index); }
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

function toggleSplitscreen() {
  splitscreen *= -1;
  if ( magnifyOn ) { magnify(); }
}

function clipValue( x, y ) {
  if ( x < 0 || x >= imgWidth || y < 0 || y >= imgHeight ){ return; }
  colour = getColour( x, y );
  colour = IndexRGB12Bit ( colour );
  value = RGBtoHSV( colour.r, colour.g, colour.b ).v;
  if ( value > 50 ) { colour = '#444444'; } else { colour = '#999999'; }
  return colour;
}

function pointer(x, y, mx, my, preview, brush) {
  
  // clear pointer canvas
  $pointCtx.clearRect(0, 0, imgPixelWidth, imgPixelHeight );
  
  pointerFlag = true;
  previewSpecial = true;

  if ( tool == 'brush' || tool == 'circle' || tool == 'ellipse' || tool == 'rectangle' ) {
    for ( i = 0 ; i < imgWidth; i++ ) {
        colour = clipValue ( i, my );
        setPixel( colour, i, my, 0, 0, preview);
    }
    for ( i = 0; i < imgHeight; i++ ) {
        colour = clipValue ( mx, i );
        setPixel( colour, mx, i, 0, 0, preview);
    }
  }
  previewSpecial = false;

  if (!brush && !clickNum && !commaDown) {
    pointerFlag = false;
    setPixel( colFG, mx, my, 0, 0, preview);
    pointerFlag = true;
  }

  var ColA = "#EE5522";
  var ColB = "#AA5522";
  
  setPixel( ColA, x+7, y, 0, 0, preview );
  setPixel( ColB, x+6, y, 0, 0, preview );
  setPixel( ColA, x+5, y, 0, 0, preview );
  setPixel( ColB, x+4, y, 0, 0, preview );
  setPixel( ColA, x+3, y, 0, 0, preview );
  setPixel( ColB, x+2, y, 0, 0, preview );

  setPixel( ColA, x-7, y, 0, 0, preview );
  setPixel( ColB, x-6, y, 0, 0, preview );
  setPixel( ColA, x-5, y, 0, 0, preview );
  setPixel( ColB, x-4, y, 0, 0, preview );
  setPixel( ColA, x-3, y, 0, 0, preview );
  setPixel( ColB, x-2, y, 0, 0, preview );

  setPixel( ColA, x, y+7, 0, 0, preview );
  setPixel( ColB, x, y+6, 0, 0, preview );
  setPixel( ColA, x, y+5, 0, 0, preview );
  setPixel( ColB, x, y+4, 0, 0, preview );
  setPixel( ColA, x, y+3, 0, 0, preview );
  setPixel( ColB, x, y+2, 0, 0, preview );

  setPixel( ColA, x, y-7, 0, 0, preview );
  setPixel( ColB, x, y-6, 0, 0, preview );
  setPixel( ColA, x, y-5, 0, 0, preview );
  setPixel( ColB, x, y-4, 0, 0, preview );
  setPixel( ColA, x, y-3, 0, 0, preview );
  setPixel( ColB, x, y-2, 0, 0, preview );
  
  pointerFlag = false;

}

function drawImageFromColourMap(){
  var imageData = $imgTempCtx.getImageData(0, 0, imgWidth, imgHeight);
  var pixels = imageData.data;
  var numPxl = frame[frameNum].pxl.length;
  var pxl;
  var colour;
  for ( i = 0; i < numPxl; i++ ){
    pxl = frame[frameNum].pxl[i];
    colour = palIndex12to24bit(pxl);
    pixels[i*4]   = colour.r; // Red
    pixels[i*4+1] = colour.g; // Green
    pixels[i*4+2] = colour.b; // Blue
  }
  $imgTempCtx.clearRect(0, 0, imgWidth, imgHeight);
  $imgTempCtx.putImageData(imageData, 0, 0);
  //update = true;
}