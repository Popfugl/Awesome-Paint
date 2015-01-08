///////////////////////////////////////////////////////////////////////////////////////////
// The very heart of the drawing functions. The routine that plots each individual pixel //
///////////////////////////////////////////////////////////////////////////////////////////

function setPixel(colour, x, y, frameNum, progress, preview, pBuffer) {
  update = true;
  // progress is used to change colour if for example a cycle range is selected.
  // a function to be implemented later.
  pX = parseInt(x);
  pY = parseInt(y);
  
  if (pX < 0 || pX >= imgWidth || pY < 0 || pY >= imgHeight) {return;}
  
  colour = parseInt(colour); // for some reason, the colour is turned into a string instead of a number!
  
  tempColor = activeColour; // Store the activeColour. If for instance a brush is drawn, we need to restore the color.
  
  $prv.fillStyle = setColour( colour );
  
  activeColour = tempColor; // Restore the activeColour
  
  if (preview)
  {
    // only plot the pixel on the preview screen.
    $prv.fillRect((pX+overscan/2) * pixelSize, (pY+overscan/2) * pixelSize, pixelSize, pixelSize);
  } 
  else
  {
    if (tool == 'sketch' || tool == 'draw') {
      if (coords) { coords += ';'+pX+','+pY;} 
      else { coords = pX+','+pY; }
    }

    var pixelNum = parseInt(pY*imgWidth+pX);
    // write the data where it matters.
    frame[frameNum].pxl[pixelNum] = colour;
    
    // then plot the pixel on the main screen.
    if (!pBuffer) {
      temp.fillStyle = $prv.fillStyle;
      temp.fillRect( pX, pY, 1, 1 ); }
    else {
      pixelBuffer.push ({
        x: x,
        y: y
      });
    }
  }
}

///////////////////////////////////////
// The actual drawing tool functions //
///////////////////////////////////////

////////////
// Sketch //
////////////
function sketch( x, y, mode, brush ) {
  // console.log('s:'+colour+','+x+','+y+','+frameNum+','+brush);
  if (brush) { /* placeBrush(activeColour, x, y, frameNum); */ } 
  else { setPixel( activeColour, x, y, frameNum); }
}

//////////
// Draw //
//////////
function draw( x1, y1, x0, y0, mode, brush ) {
  drawLine( x0, y0, x1, y1, mode, brush);
}

//////////
// Line //
//////////
function drawLine( x0, y0, x1, y1, mode, brush, preview ) {
//  if (clickNum == 0) {debugger}
  //if (!preview){ console.log('l:'+colour,x0+','+y0,x1+','+y1,brush); }
  dirX = 1;
  dirY = 1;
  
  if (x0 > x1) {dirX=-1; lenX = (x0-x1)+1;} else {lenX = (x1-x0)+1;}
  if (y0 > y1) {dirY=-1; lenY = (y0-y1)+1;} else {lenY = (y1-y0)+1;}
  
  if (Math.abs(lenX) < Math.abs(lenY))
  {
    for (i = 0; i < lenY; i++)
    {
      stepX = (lenX/lenY)*dirX;
      stepY = dirY;
      setPixel(activeColour, x0 + parseInt(stepX * i), y0 + parseInt(stepY * i), frameNum, brush, preview, false);
    }
  }
  else
  {
    for (i = 0; i < lenX; i++)
    {
      stepX = dirX;
      stepY = (lenY/lenX)*dirY;
      setPixel(activeColour, x0 + parseInt(stepX * i), y0 + parseInt(stepY * i), frameNum, brush, preview, false);
    }
  }
  if (tool == 'line') {
    radius = Math.sqrt( (lenX * lenX) + (lenY * lenY) );
    degrees = Math.floor(getDegrees( lenX, lenY ) * 1) / 1;
//    writeMessage( 'r: '+parseInt(radius)+' '+ degrees +'° ', x1-x0, y1-y0 );
    writeMessage( 'r: '+parseInt(radius)+' ', x1-x0, y1-y0 );
  }
}

function getDegrees( lenX, lenY ){
  var slope = parseFloat(lenY / lenX);
//  var theta = Math.atan2( -lenY, lenX );
  return Math.atan(slope);
//  return theta //* 180 / Math.PI;
}


///////////
// Curve //
///////////
function curve( Ax, Ay, Bx, By, Cx, Cy, brush, mode, preview ){
  // get the point (P02) halfway between P0 and P2 (AKA AB)
  // First find AB
  distAB = getLength(Ax,Ay,Bx,By);
  ABx = Ax + (distAB.lenX/2);
  ABy = Ay + (distAB.lenY/2);
  
  // get the point (P1) by doubling the length from P02 to C
  distAB_C = getLength(ABx,ABy,Cx,Cy);
  // Deduce P1 at |AB_C|*2
  P1x = ABx + (distAB_C.lenX * 2);
  P1y = ABy + (distAB_C.lenY * 2);

  // console.log(preview);
  
  bezier( Ax, Ay, P1x, P1y, Bx, By, preview );
  // pastePixelBuffer();
}

//////////
// Fill //
//////////
function floodFill(colour, startX, startY){

  pixelStack = [[startX, startY]];
  startColour = getColour(startX,startY);
  // console.log(startColour, startX,startY);
  brk = false;
  
  while(pixelStack.length && brk != true && startColour != colour)
  {
    $(document).keyup(function(e) {
      if (e.keyCode == 27) { brk = true; }   // esc
    });
    
    var newPos, x, y, reachLeft, reachRight;
    pixelStack = pixelStack;
    newPos = pixelStack.pop();
    x = newPos[0];
    y = newPos[1];

    while(y-- >= 0 && matchStartColor(x,y))
    {
      // y is decreasing as long as it doesn't meet a boundary.
    }
    reachLeft = false;
    reachRight = false;
    while(y++ < imgHeight-1 && matchStartColor(x,y))
    {
      setPixel( colour, x, y, frameNum );

      if(x > 0)
      {
        if(matchStartColor(x-1,y))
        {
          if(!reachLeft){
            // console.log(x-1,y);
            pixelStack.push([x - 1, y]);
            reachLeft = true;
          }
        }
        else if(reachLeft)
        {
          reachLeft = false;
        }
      }

      if(x < imgWidth-1)
      {
        if(matchStartColor(x+1,y))
        {
          if(!reachRight)
          {
            // console.log(x+1,y);
            pixelStack.push([x + 1, y]);
            reachRight = true;
          }
        }
        else if(reachRight)
        {
          reachRight = false;
        }
      }

    }
  }

  pastePixelBuffer();
}
  
function matchStartColor(x, y)
{
  var thisColour = getColour(x,y);
  return (thisColour == startColour);
}

function pastePixelBuffer() {
  NumPixels = pixelBuffer.length;
  pixelBuffer = pixelBuffer.sort(sortByPosition);
  if (!pixelBuffer) { return; }
  if (pixelBuffer.length == 1)
  {
    pos = pixelBuffer.pop();
    fillRect(pos.x,pos.y);
    return;
  } 
  var a1, b0, b1;
  while (pixelBuffer.length)
  {
    if (!a1)
    { 
      a1 = pixelBuffer.shift(); // first item - keep this
      b0 = a1; 
    } 
    else { b0 = b1; }
    
    b1 = pixelBuffer.shift(); // second item is either first item.x+1, item.y or a different item.y
    if (a1.y == b1.y) {
      if (b1.x > b0.x+1) // a gap in the line has occured.
      { 
        fillRect(a1,b0);
        a1 = b1;
      } 
    } else {
      fillRect(a1,b0);
      a1 = b1;// the end of the line has come.
    }

  }
}

function sortByPosition(a, b){
  if (a.y == b.y) return a.x - b.x;
  return a.y - b.y;
}

function fillRect(a, b) {
  $ctx.fillRect(a.x*pixelSize, a.y*pixelSize, (1+b.x-a.x)*pixelSize, pixelSize);
}



///////////////
// Rectangle //
///////////////
function rectangle( x0, y0, x1, y1, filled, rotation, mode, brush, preview ) {
  var length = getLength( x0, y0, x1, y1 );
  lenX = length.lenX;
  lenY = length.lenY;
  len = lenY;

  drawLine( x0, y0, x1, y0, mode, brush, preview );
  drawLine( x1, y0, x1, y1, mode, brush, preview );
  drawLine( x1, y1, x0, y1, mode, brush, preview );
  drawLine( x0, y1, x0, y0, mode, brush, preview );
  if (filled) { $prv.fillRect((x0+overscan/2) * pixelSize, (y0+overscan/2) * pixelSize, lenX * pixelSize, lenY * pixelSize); }

  if (filled){
    if (len < 0) {step = -1; } else { step = 1; }
    if (!preview) {
      for (y = 0; y <= Math.abs(len); y++) {
        if (escPressed) { escPressed = false; return; }
        drawLine( x0, y0 + (y*step), x1, y0 + (y*step), mode, brush, preview);
      }
    }
  }
  
  writeMessage( '', lenX, lenY );
}

////////////
// Circle //
////////////
function circle( x0, y0, x1, y1, filled, mode, brush, preview) {
  
}

/////////////
// Ellipse //
/////////////
function ellipse( x0, y0, x1, y1, filled, rotation, mode, brush, preview) {
  
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
  if(colour == null) {colour = activeColour;}
  // dbug('k:'+colour+','+frameNum);
  // console.log('K:'+colour);
  pixel = [];
  
  // Fill the pixel array with the background colour.
  for (sY=0; sY<imgHeight; sY++){
    for (sX=0; sX<imgWidth; sX++){
      pixel[(sY*imgWidth)+sX] = colour;
    }
  }
  // Put the pixel array in the right frame.
  frame[frameNum].pxl = pixel;
  
  // Also clear the main canvas with the right colour.
  temp.fillStyle = setColour(colour, frameNum);
  temp.fillRect(0, 0, imgWidth*pixelSize, imgHeight*pixelSize);
  $ctx.drawImage(t,0,0,imgWidth*pixelSize,imgHeight*pixelSize);
}

