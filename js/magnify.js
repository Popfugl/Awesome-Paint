function magnify() {
  
  if ( !multiplier || multiplier <= zoomLevel ) { multiplier = zoomLevel + 1; }
  
  var magWidth;
  var magHeight = imgHeight;
  
  if ( fullscreen ) {
    magPosX = 0;
    magWidth = imgWidth;
  } else {
    magPosX = imgPixelWidth / 4; // 3 quarters of the screen is used for the magnify screen
    magWidth = Math.round( imgWidth * 3 / 4 );
  }
  
  magStart = magPosX / pixelSize;
  
  var magInnerWidth = Math.round( magWidth / multiplier );
  var magInnerHeight = Math.round( magHeight / multiplier );
  
  var clipX = Math.round( magCenterX - ( magInnerWidth / 2 ) );
  var clipY = Math.round( magCenterY - ( magInnerHeight / 2 ) );
  
  if ( clipX < 0 ) { clipX = 0; }
  if ( clipY < 0 ) { clipY = 0; }
  if ( clipX > imgWidth - magInnerWidth ) { clipX = imgWidth - magInnerWidth; }
  if ( clipY > imgHeight - magInnerHeight ) { clipY = imgHeight - magInnerHeight; }
  
  // adjust clipMainX and clipMainY to the main Canvas view
  var clipMainX = Math.round( magCenterX - ( magStart / 2 ) );
  var clipMainY = Math.round( magCenterY - ( magStart / 2 ) );
  
  if ( clipMainX < 0 ) { clipMainX = 0; }
  if ( clipMainY < 0 ) { clipMainY = 0; }
  if ( clipMainX > imgWidth - ( Math.round( imgWidth / 4 ) ) ) { clipMainX = ( Math.round( imgWidth / 4 ) ); }
  if ( clipMainY > imgHeight - ( Math.round( imgHeight / 1 ) ) ) { clipMainY = ( Math.round( imgHeight / 1 ) ); }
  
  clipMainY = 0;
  
  // set global mouse adjustments
  magAdjustX = clipX;
  magAdjustY = clipY;
  imgAdjustX = clipMainX;
  imgAdjustY = clipMainY;
  
  // Clear and draw the updated main canvas at the new position
  clearMainCanvas();
  $imgCtx.drawImage( $imgTemp, clipMainX, clipMainY, magPosX, imgHeight, 0, 0, magPosX * pixelSize, imgPixelHeight );
  $imgCtx.drawImage( $ovrTemp, clipMainX, clipMainY, magPosX, imgHeight, 0, 0, magPosX * pixelSize, imgPixelHeight );
  
  // clear and draw the magnify canvas
  clearMagnify();
  $magCtx.drawImage( $imgTemp, clipX, clipY, magInnerWidth, magInnerHeight, magPosX, 0, magInnerWidth * multiplier * pixelSize, imgPixelHeight);
  $magCtx.drawImage( $ovrTemp, clipX, clipY, magInnerWidth, magInnerHeight, magPosX, 0, magInnerWidth * multiplier * pixelSize, imgPixelHeight);
  $magCtx.fillStyle = "#777777";
  $magCtx.fillRect( magPosX, 0, 1, imgPixelHeight );
  $magCtx.fillStyle = "#000000";
  $magCtx.fillRect( magPosX-1, 0, 1, imgPixelHeight );

  $ovrCtx.clearRect( 0, 0, imgPixelWidth, imgPixelHeight );
}

function clearMainCanvas() {
  $imgCtx.clearRect ( 0, 0, imgPixelWidth, imgPixelHeight );
}

function clearMagnify() {
  $magCtx.clearRect( 0, 0, imgPixelWidth, imgPixelHeight );
}