addFrame(currentFrame);
  

$(document).ready(function(){

  // Sets the screen to update every 1/60 of a second.
  setInterval(function(){
    if (update){
      updateScreen();
      update = false;
    }
  }, 1000/60 ); // Set framerate 60 frames per second.

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
  var cv1 = '<canvas id="imageCanvas" width="' + imgPixelWidth + '" height="' + imgPixelHeight + '"></canvas>';
  var cv2 = '<canvas id="overlayCanvas" width="' + imgPixelWidth + '" height="' + imgPixelHeight + '"></canvas>';
  var cv3 = '<canvas id="magnifyCanvas" width="' + imgPixelWidth + '" height="' + imgPixelHeight + '"></canvas>';
  var cv4 = '<canvas id="pointerCanvas" width="' + imgPixelWidth + '" height="' + imgPixelHeight + '"></canvas>';
  var cvImageTemp = '<canvas id="imageTempCanvas" width="'+imgWidth+'" height="'+imgHeight+'"></canvas>';
  var cvOverlayTemp = '<canvas id="overlayTempCanvas" width="'+imgWidth+'" height="'+imgHeight+'"></canvas>';
  
  $('#canvasContainer').html( cv1 + '\n' + cv2 + '\n' + cv3 + '\n' + cv4 + '\n' );
  $('#overlayTemp').html(cvOverlayTemp);
  $('#imageTemp').html(cvImageTemp);
  
  
  $('#imageCanvas, #overlayCanvas, #magnifyCanvas, #pointerCanvas').css( "margin", overscan * pixelSize / 2 );
  $('#canvasContainer').css( 'width', ( imgPixelWidth + overscan * pixelSize ) ).css( 'height', ( imgPixelHeight + overscan * pixelSize ) );
  
  $('#output').height( imgPixelHeight - 12 );
  $('#input').width( $('#outputContainer').width() - 2);
  
  // Image
  // get the main canvas ready
  $img = document.getElementById('imageCanvas');
  $imgCtx = $img.getContext('2d');
  $imgCtx.imageSmoothingEnabled = false;
  $imgCtx.webkitImageSmoothingEnabled = false;
  $imgCtx.mozImageSmoothingEnabled = false;
  
  // Overlay
  $ovr = document.getElementById('overlayCanvas');
  $ovrCtx = $ovr.getContext('2d');
  $ovrCtx.imageSmoothingEnabled = false;
  $ovrCtx.webkitImageSmoothingEnabled = false;
  $ovrCtx.mozImageSmoothingEnabled = false;
  
  // Magnify
  $mag = document.getElementById('magnifyCanvas');
  $magCtx = $mag.getContext('2d');
  $magCtx.imageSmoothingEnabled = false;
  $magCtx.webkitImageSmoothingEnabled = false;
  $magCtx.mozImageSmoothingEnabled = false;
  
  // Pointer
  $point = document.getElementById('pointerCanvas');
  $pointCtx = $point.getContext('2d');
  $pointCtx.imageSmoothingEnabled = false;
  $pointCtx.webkitImageSmoothingEnabled = false;
  $pointCtx.mozImageSmoothingEnabled = false;
  
  // imageTempCanvas is the 1:1 truecolor image.
  // get the image temp canvas ready
  $imgTemp = document.getElementById('imageTempCanvas');
  $imgTempCtx = $imgTemp.getContext('2d');
  $imgTempCtx.imageSmoothingEnabled = false;
  $imgTempCtx.webkitImageSmoothingEnabled = false;
  $imgTempCtx.mozImageSmoothingEnabled = false;

  // overlayTempCanvas is the 1:1 truecolor image.
  // get the temp canvas ready
  $ovrTemp = document.getElementById('overlayTempCanvas');
  $ovrTempCtx = $ovrTemp.getContext('2d');
  $ovrTempCtx.imageSmoothingEnabled = false;
  $ovrTempCtx.webkitImageSmoothingEnabled = false;
  $ovrTempCtx.mozImageSmoothingEnabled = false;

  
  // Position elements on the screen relative to the image width
  
  //$('.sidebar').width();
  $('#wrap').css( 'margin-left', -(imgPixelWidth/2)-172 );
  $('#topBar').width(imgPixelWidth+2).css( 'padding-left', 192 );
  
  // Canvas positioning
  $('#toolContainer').width( imgPixelWidth + 2 ).css( 'margin-left', overscan / 2 * pixelSize );
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
  update = true;
  
});


