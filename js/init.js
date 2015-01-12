addFrame(currentFrame);
var cv = $('#preview');

$(document).ready(function(){
  $('#initZoom').val(zoomLevel);
  
  colour = colFG; // Set the starting colour here.
  $('#foregroundColour').val(colFG); // Set the starting colour in the menu.
  $('#backgroundColour').html($('#foregroundColour').html()); // copy the entire selector set.
  $('#backgroundColour').val(colBG);
  $('#tooltype').val(tool);
  
  pixelSize = $('#initZoom').val();
  imgPixelWidth = imgWidth * pixelSize;
  imgPixelHeight = imgHeight * pixelSize;
  
  // Set up canvas with correct sizes:
  cv1 = '<canvas id="c" width="' + imgPixelWidth + '" height="' + imgPixelHeight + '"></canvas>';
  cv2 = '<canvas id="preview" width="' + (imgWidth+overscan) * pixelSize + '" height="'+( imgHeight + overscan ) * pixelSize + '"></canvas>';
  cv3 = '<canvas id="tempCanvas" width="'+imgWidth+'" height="'+imgHeight+'"></canvas>';
  $('#canvasContainer').html(cv1+cv2);
  $('#tempC').html(cv3);
    
  $('#c').css("margin",overscan*pixelSize/2+"px");
  $('#canvasContainer').css('height',$('#preview').height()).css('width',$('#preview').width()-overscan);
  
  $('#output').height( imgHeight * pixelSize -12 );
  

  // tempCanvas is the 1:1 truecolor image.
  // get the temp canvas ready
  t = document.getElementById('tempCanvas');
  $('#tempCanvas').width(imgWidth).height(imgHeight);
  temp = t.getContext('2d');
  temp.imageSmoothingEnabled = false;
  temp.webkitImageSmoothingEnabled = false;
  temp.mozImageSmoothingEnabled = false;
  

  // get the main canvas ready
  $c = document.getElementById('c');
  $ctx = $c.getContext('2d');
  $ctx.imageSmoothingEnabled = false;
  $ctx.webkitImageSmoothingEnabled = false;
  $ctx.mozImageSmoothingEnabled = false;

  
  // the preview canvas is the overlay for the pointer and noncomitted drawing functions, such as a line being positioned.
  // get the preview canvas ready
  $p = document.getElementById('preview');
  $prv = $p.getContext('2d');
  $prv.imageSmoothingEnabled = false;
  $prv.webkitImageSmoothingEnabled = false;
  $prv.mozImageSmoothingEnabled = false;
  
  
  // Position elements on the screen relative to the image width
  
  //$('.sidebar').width();
  $('#wrap').css( 'margin-left', -(imgPixelWidth/2)-172 );
  $('#topBar').width(imgPixelWidth+2).css( 'padding-left', 192 );
  $('#c, #preview').css( 'left', -(overscan*pixelSize/2) + 1 );
  $('#preview').css( 'cursor', 'none' );
  $('#toolContainer').width( imgPixelWidth + 2 );
  //$('#foregroundColour, #backgroundColour').width(( imgWidth * pixelSize / 4) - 2);
  
  
  // Size the tool buttons
  btnwidth = ($('#toolContainer').width()+8)/($('.tool').length/2);
  $('.tool').width(btnwidth-12);
  $('#row1 div:first, #row2 div:first').css('margin-left','0');
  $('#row1 div:last, #row2 div:last').css('margin-right','0');
  
  // initialize palette number 4
  initPalette(4);
  displayPalette();

  // clear the screen with the selected background colour
  clearScreen(0);
  setColour(1);
  initRGBSliders(1);
  saveToHistoryBuffer('//initialising');
  
  // drawLine(8, 1,1, 15,10, 0,0);
  // cx = 51; cy = 102; 
  // cx = 150; cy = 100;
  // curve( 27, 100,255, 250,150, cx,cy ); // test the curve.
  /*
  setColour(2);
  curve(111,59,148,183,200,106);
  curve(163,55,174,192,123,110);
  drawLine(139,129,187,119,0);
  setColour(1);
  floodFill(1,161,97);
  */
  // drawLine(2,0,1,1,0,0);
  // setPixel(31,1,1,0);

  //  setPixel(10, cx, cy, 0, 0);
});


