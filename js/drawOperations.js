function updateScreen() {
  // Copy the 1:1 image while scaling it to the screen.
  $imgCtx.drawImage( $imgTemp, 0, 0, imgPixelWidth, imgPixelHeight );
}

function updatePreviewScreen() {
  $ovrCtx.clearRect( 0, 0, imgPixelWidth, imgPixelHeight );
  $ovrCtx.drawImage( $ovrTemp, 0, 0, imgPixelWidth, imgPixelHeight );
  if ( magnifyOn ) { magnify(); }
  $ovrTempCtx.clearRect( 0, 0, imgWidth, imgHeight );
}

///////////////////////////////////////////////////////////////////////////////////////////
// The very heart of the drawing functions. The routine that plots each individual pixel //
///////////////////////////////////////////////////////////////////////////////////////////

function setPixel( colour, x, y, frameNum, progress, preview, pBuffer ) {
  
  // progress is used to change colour if for example a cycle range is selected.
  // a function to be implemented later.
  x = parseInt(x);
  y = parseInt(y);
  
  if ( tool == 'fill' ) { pBuffer = true; }
  
  // Do not draw outside of screen
  if ( x < 0 || x >= imgWidth || y < 0 || y >= imgHeight ) { return; }
  
  colour = parseInt(colour);
  
  tmpColor = activeColour; // Store the activeColour. If for instance a brush is drawn, we need to restore the color.
  
  $ovrTempCtx.fillStyle = setColour( colour );
  $pointCtx.fillStyle = setColour( colour );
  
  activeColour = tmpColor; // Restore the activeColour
  
  if ( !pointerFlag ) {
    if (preview)
    {
      // only plot the pixel on the preview screen.
      $ovrTempCtx.fillRect( x, y, 1, 1 );
    }
    else
    {
      var pixelNum = parseInt( y * imgWidth + x );
      // write the data where it matters.
      frame[frameNum].pxl[pixelNum] = colour;

      // then plot the pixel on the main screen.
      if (!pBuffer) {
        $imgTempCtx.fillStyle = $ovrTempCtx.fillStyle;
        $imgTempCtx.fillRect( x, y, 1, 1 ); 

        // Something is being drawn to the screen, so next interval would be a good time to update the screen.
        update = true;
      }
      else {
        pixelBuffer.push ({
          x: x,
          y: y
        });
      }
    }
  } else {
    // only plot the pointer on the pointer canvas
    $pointCtx.fillRect( parseInt(x * pixelSize), parseInt(y * pixelSize), pixelSize, pixelSize );
  }
}


///////////////////////////////////////
// The actual drawing tool functions //
///////////////////////////////////////


////////////
// Sketch //
////////////
function sketch( x, y, mode, brush ) {
  updateCoords( x, y );
  if (brush) { /* placeBrush( activeColour, x, y, frameNum ); */ } 
  else { setPixel( activeColour, x, y, frameNum ); }
}


//////////
// Draw //
//////////
function draw( x1, y1, x0, y0, mode, brush ) {
  drawLine( x0, y0, x1, y1, mode, brush );
}


//////////
// Line //
//////////
function drawLine( x0, y0, x1, y1, mode, brush, preview ) {
  length = getLength( x0, y0, x1, y1 );

  lenX = length.lenX;
  lenY = length.lenY;
  
  if ( tool == 'sketch' || tool == 'draw' ) {
    updateCoords( x0, y0 );
  }

  if ( Math.abs( lenX ) < Math.abs( lenY ) )
  {
    for ( i = 0; i <= Math.abs( lenY ); i++ )
    {
      stepX = ( lenX / Math.abs( lenY ) );
      stepY = length.dirY;
      
      setPixel( activeColour,
               x0 + Math.round( stepX * i ),
               y0 + Math.round( stepY * i ),
               frameNum,
               brush,
               preview,
               true );
    }
  }
  else
  {
    for (i = 0; i <= Math.abs( lenX ); i++)
    {
      stepX = length.dirX;
      stepY = ( lenY / Math.abs( lenX ) );
      
      setPixel( activeColour, 
               x0 + Math.round( stepX * i ), 
               y0 + Math.round( stepY * i ), 
               frameNum, 
               brush, 
               preview, 
               true );
    }
  }
  
  pastePixelBuffer();
  
  if (tool == 'line') {
    radius = Math.sqrt( ( lenX * lenX ) + ( lenY * lenY ) );
    degrees = Math.floor( getDegrees( lenX, lenY ) * 1 ) / 1;
    writeMessage( '', degrees+'°', parseInt( radius ), true );
  }
}

function updateCoords( x, y ) {
  if ( coords ) {
    
    // if the colour has changed, add it. Even if the mouse hasn't moved.
    if ( parseInt( activeColour ) != parseInt( lastCoordColour ) ) {
      coords += ';c' + activeColour + '_' + x + ',' + y;
      lastCoordColour = activeColour;
//    debugger;
    } else {
      // if the colour hasn't changed and the mouse hasn't moved, ignore it.
      if ( lastCoordX == x && lastCoordY == y ) { return; }
      // if the mouse has moved, add it.
      else { coords += ';' + x + ',' + y; }
    }
  } else {
    coords = x+','+y;
  }
}

function getDegrees( lenX, lenY ){
  var slope = parseFloat( lenY / lenX );
  var theta = Math.atan2( -lenY, lenX );
  var get360 = theta * 180 / Math.PI;
  if (get360 < 0) { get360 += 360; }
  return get360;
}


///////////
// Curve //
///////////
function curve( Ax, Ay, Bx, By, Cx, Cy, brush, mode, preview ){
  // get the point (P02) halfway between P0 and P2 (AKA AB)
  // First find AB
  distAB = getLength( Ax, Ay, Bx, By );
  ABx = Ax + ( distAB.lenX / 2 );
  ABy = Ay + ( distAB.lenY / 2 );
  
  // get the point (P1) by doubling the length from P02 to C
  distAB_C = getLength( ABx, ABy, Cx, Cy );
  // Deduce P1 at |AB_C|*2
  P1x = ABx + ( distAB_C.lenX * 2 );
  P1y = ABy + ( distAB_C.lenY * 2 );

  // console.log(preview);
  
  bezier( Ax, Ay, P1x, P1y, Bx, By, preview );
  // if (pixelBuffer) { pastePixelBuffer(); }
}


//////////
// Fill //
//////////
function floodFill( colour, startX, startY ){

  pixelStack = [[startX, startY]];
  startColour = getColour( startX, startY );
  if (startColour == colour) { return; }
  
  brk = false;
  
  while( pixelStack.length && brk != true && startColour != colour )
  {
    var newPos, x, y, reachLeft, reachRight;
    //pixelStack = pixelStack;
    var newPos = pixelStack.pop();
    var x = newPos[0];
    var y = newPos[1];

    while( y-- >= 0 && matchStartColor( x, y ) )
    {
      // y is decreasing as long as it doesn't meet a boundary.
    }
    reachLeft = false;
    reachRight = false;
    while( y++ < imgHeight-1 && matchStartColor( x, y ) )
    {
      setPixel( colour, x, y, frameNum );

      if(x > 0)
      {
        if( matchStartColor( x-1, y ) )
        {
          if(!reachLeft){
            pixelStack.push([ x - 1, y ]);
            reachLeft = true;
          }
        }
        else if( reachLeft )
        {
          reachLeft = false;
        }
      }

      if( x < imgWidth - 1 )
      {
        if( matchStartColor( x+1, y ) )
        {
          if( !reachRight )
          {
            pixelStack.push([ x + 1, y ]);
            reachRight = true;
          }
        }
        else if( reachRight )
        {
          reachRight = false;
        }
      }

    }
  }
  if ( pixelBuffer ){ pastePixelBuffer(); }
}
  
function matchStartColor( x, y )
{
  var thisColour = getColour( x, y );
  return ( thisColour == startColour );
}

function pastePixelBuffer() {
  // fill colour is not set here, so remember to do that before using pastePixelBuffer()!
  
  NumPixels = pixelBuffer.length;
  pixelBuffer = pixelBuffer.sort( sortByPosition );
  if ( !pixelBuffer ) { return; }
  var a1, b0, b1;
  while ( pixelBuffer.length )
  {
    if ( !a1 ) { 
      a1 = pixelBuffer.shift(); // first item - keep this
      b0 = a1;
    } else { b0 = b1; }
    
    if ( !pixelBuffer.length ) { fillRect( a1, b0 ); return; }
    
    b1 = pixelBuffer.shift(); // second item is either first item.x+1, item.y or a different item.y
    if ( a1.y == b1.y ) {
      if ( b1.x > b0.x + 1 ) // a gap in the line has occured.
      { 
        fillRect( a1, b0 );
        a1 = b1;
      } 
    } else {
      fillRect( a1, b0 );
      a1 = b1;// the end of the line has come.
    }

  }
  fillRect( a1, b1 );
  update = true;
}

function sortByPosition( a, b ){
  if ( a.y == b.y ) return a.x - b.x;
  return a.y - b.y;
}

function fillRect( a, b ) {
  if ( a && b ){ $imgTempCtx.fillRect( a.x, a.y, ( 1 + b.x - a.x ), 1 ) };
}


///////////////
// Rectangle //
///////////////

// Consider using ( x-start, y-start, width, height ) instead of ( x-start, y-start, x-end, y-end ).

function rectangle( x0, y0, x1, y1, filled, rotation, mode, brush, preview ) {
  var length = getLength( x0, y0, x1, y1 );
  lenX = length.lenX;
  lenY = length.lenY;
  len = parseInt( lenY );

  drawLine( x0, y0, x1, y0, mode, brush, preview );
  drawLine( x1, y0, x1, y1, mode, brush, preview );
  drawLine( x1, y1, x0, y1, mode, brush, preview );
  drawLine( x0, y1, x0, y0, mode, brush, preview );
  if ( filled ) { $ovrTempCtx.fillRect( ( x0 + overscan / 2 ) * pixelSize, ( y0 + overscan / 2 ) * pixelSize, lenX * pixelSize, lenY * pixelSize ); }
  if ( filled ){
    if ( len < 0 ) {step = -1; } else { step = 1; }
    if ( !preview ) {
      for ( y = 0; y <= Math.abs( len ); y++ ) {
        drawLine( x0, y0 + ( y * step ), x1, y0 + ( y * step ), mode, brush, preview );
      }
    }
  }
  if (escPressed) {debugger;}
  if (filled){ var cmd = 'Filled '; } else { cmd = '';}
  writeMessage( cmd + 'Rectangle', length.lenX, length.lenY );
}

////////////
// Circle //
////////////
function circle( x0, y0, x1, y1, filled, mode, brush, preview) {
  // if (escPressed){escPressed = false; debugger;}
  len = getLength( x0, y0, x1, y1 );
  var lenX = len.lenX;
  var lenY = len.lenY;
  var radius = Math.sqrt( ( lenX * lenX ) + ( lenY * lenY ) );
  radius = Math.round ( radius );
  var lastX, lastY;
  var iterations = radius * 8;
  
  // Most of the circle can be filled with a rectangle.
  // rsq is the length from the center that doesn't need to be drawn just yet. 
  // - It will be filled by a rectangle later.
  var rsq = Math.round( radius * ( 1 / Math.sqrt( 2 ) ) );
  
  if ( !radius ) { setPixel( activeColour, x0, y0, frameNum, 1, preview ); } 
  if ( radius == 1 ) { 
    setPixel( activeColour, x0,     y0 - 1, frameNum, 0, preview );
    setPixel( activeColour, x0 + 1, y0,     frameNum, 0.33, preview );
    setPixel( activeColour, x0 - 1, y0,     frameNum, 0.66, preview );
    setPixel( activeColour, x0,     y0 + 1, frameNum, 1, preview );
    if ( filled ) { setPixel( activeColour, x0, y0, frameNum, 1, preview ); } 
  } 
  
  if ( radius > 1 ) {
    // Only calculate 1/8 of the circle - then copy that bit 8 times flipped and turned to draw the full circle.
    for( var i = 0; i <= iterations/8; i++ ) {
      var x = Math.round( radius * Math.cos( 2 * Math.PI * i / iterations ) );
      var y = Math.round( radius * Math.sin( 2 * Math.PI * i / iterations ) );

      if ( lastY != y ) {
        if ( x < lastX - 1 ){
          x = lastX-1;
        }
        if ( y > lastY + 1 ){
          y = lastY+1;
        }
        
        if ( filled && !preview ) {
          drawLine( x0 - x, y0 - y, x0 + x, y0 - y, mode, brush, preview );
          drawLine( x0 - x, y0 + y, x0 + x, y0 + y, mode, brush, preview );

          drawLine( x0 + y, y0 + rsq, x0 + y, y0 + x, mode, brush, preview );
          drawLine( x0 - y, y0 - rsq, x0 - y, y0 - x, mode, brush, preview );
          drawLine( x0 - y, y0 + rsq, x0 - y, y0 + x, mode, brush, preview );
          drawLine( x0 + y, y0 - rsq, x0 + y, y0 - x, mode, brush, preview );
        }

        setPixel( activeColour, x0 + x, y0 + y, frameNum, i/iterations, preview );
        setPixel( activeColour, x0 + y, y0 + x, frameNum, i/iterations, preview );
        setPixel( activeColour, x0 - y, y0 + x, frameNum, i/iterations, preview );
        setPixel( activeColour, x0 - x, y0 + y, frameNum, i/iterations, preview );

        setPixel( activeColour, x0 + x, y0 - y, frameNum, i/iterations, preview );
        setPixel( activeColour, x0 + y, y0 - x, frameNum, i/iterations, preview );
        setPixel( activeColour, x0 - y, y0 - x, frameNum, i/iterations, preview );
        setPixel( activeColour, x0 - x, y0 - y, frameNum, i/iterations, preview );

        lastX = x
      }
      lastY = y;

    }
    
    degrees = Math.floor( getDegrees( lenX, lenY ) * 1 ) / 1;
    writeMessage( '', degrees+'°', parseInt(radius), true );
  }
  
}

/////////////
// Ellipse //
/////////////
function ellipse( x0, y0, x1, y1, filled, rotation, mode, brush, preview) {
//  if (escPressed){ escPressed = false; debugger; }
  len = getLength( x0, y0, x1, y1 );
  var lenX = len.lenX;
  var lenY = len.lenY;
  var radiusX = Math.round ( Math.abs( lenX ) );
  var radiusY = Math.round ( Math.abs( lenY ) );
  var radius = Math.round ( Math.sqrt( ( lenX * lenX ) + ( lenY * lenY ) ) );
  var flip = false;
  var ok = false;
  
  var lastX;
  var lastY;
  var iterations = radius * 7;
  var halfIterations = iterations / 2;
  
  // Most of the ellipse can be filled with a rectangle.
  // rsq is the length from the center that doesn't need to be drawn just yet. 
  // - It will be filled by a rectangle later.
  var rsqX = Math.floor( radiusX * ( 1 / Math.sqrt(2) ) );
  var rsqY = Math.floor( radiusY * ( 1 / Math.sqrt(2) ) );
  
  if ( !radius ) { setPixel( activeColour, x0, y0, frameNum, 1, preview ); } 
  if ( radius == 1 ) { 
    setPixel( activeColour, x0,     y0 - 1, frameNum, 0, preview );
    setPixel( activeColour, x0 + 1, y0,     frameNum, 0.33, preview );
    setPixel( activeColour, x0 - 1, y0,     frameNum, 0.66, preview );
    setPixel( activeColour, x0,     y0 + 1, frameNum, 1, preview );
    if (filled) { setPixel( activeColour, x0, y0, frameNum, 1, preview ); }
  } 
  
  if ( radius > 1 ) {
    // Only calculate 1/4 of the ellipse - then copy that bit 4 times flipped to draw the full ellipse.
    for( var i = 0; i <= parseInt( iterations / 4 ); i++ ) {
      var x = Math.round( radiusX * Math.cos( 2 * Math.PI * i / iterations ) );
      var y = Math.round( radiusY * Math.sin( 2 * Math.PI * i / iterations ) );
      
      if ( y > lastY + 1 ){
        y = lastY+1;
        ok = true;
      }
      
      if ( lastX != x ) { 
        if ( x < lastX - 1 ){ x = lastX - 1; }
        ok = true;
      }

      if (ok) {
          if (filled && !preview) {
            if (i >= halfIterations / 4 ) { drawLine( x0 - x, y0 - y, x0 + x, y0 - y, mode, brush, preview ); }
            if (i <= halfIterations / 4 ) { drawLine( x0 - x, y0 - y, x0 + x, y0 - y, mode, brush, preview ); }
            if (i <= halfIterations / 4 ) { drawLine( x0 +x, y0 + y, x0 - x, y0 + y, mode, brush, preview ); }
            if (i >= halfIterations / 4 ) { drawLine( x0 + x, y0 + y, x0 - x, y0 + y, mode, brush, preview ); }
          }
          setPixel( activeColour, x0 + x, y0 + y, frameNum, i/iterations, preview );
          setPixel( activeColour, x0 - x, y0 + y, frameNum, i/iterations, preview );
          setPixel( activeColour, x0 + x, y0 - y, frameNum, i/iterations, preview );
          setPixel( activeColour, x0 - x, y0 - y, frameNum, i/iterations, preview );

        lastX = x;
        lastY = y;
      }
      ok = false;
    }
    setPixel( activeColour, x0, y0 + lenY, frameNum, i/iterations, preview );
    setPixel( activeColour, x0, y0 - lenY, frameNum, i/iterations, preview );
    
    writeMessage( '', parseInt( radiusX*2+1 ), parseInt( radiusY*2+1 ), false );
  }
}


/////////////
// Polygon //
/////////////
function polygon( clickBuffer, filled, rotation, mode, brush, preview) {
  
}


/////////
// CLS //
/////////
function clearScreen (colour) {
  if( colour == null ) { colour = activeColour; }
  pixel = [];
  
  // Fill the pixel array with the background colour.
  for ( sY = 0; sY < imgHeight; sY++ ){
    for ( sX =0; sX < imgWidth; sX++){
      pixel[( sY * imgWidth ) + sX] = colour;
    }
  }
  // Put the pixel array in the right frame.
  frame[frameNum].pxl = pixel;
  
  // Also clear the main canvas with the right colour.
  $imgTempCtx.fillStyle = setColour( colour, frameNum );
  $imgTempCtx.fillRect( 0, 0, imgPixelWidth, imgPixelHeight );
}

