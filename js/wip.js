// draw a quad-bezier.
// convert quad-bezier to cube-bezier
// 


function quad2Cubic(P0x, P0y, Cx, Cy, P3x, P3y) {
  // get the (Cubic) point (P1) (AKA) |P3_C|*1.33333
  distP3_C = getLength( P0x, P0y, Cx, Cy );
  P1x = P0x + (distP3_C.lenX/2);
  P1y = P0y + (distP3_C.lenY/2);
  
  // get the (Cubic) point (P2) (AKA) |P0_C|*1.33333
  distP0_C = getLength( P0x, P0y, P3x, P3y );
  P2x = Bx + (distP1B.lenX * 1.33);
  P2y = By + (distP1B.lenY * 1.33);

  
  P1cx = ABx + (distAB_C.lenX * 0.8);
  P1cy = Ay + (distAB_C.lenY * 1.33);
  P2cx = ABx + (distAB_C.lenX * 0.8);
  P2cy = By + (distAB_C.lenY * 1.33);
  

  P0cx = Ax;
  P0cy = Ay;
  P3cx = Bx;
  P3cy = By;

  console.log( /*P02x, P0y, P1cx, P1cy, P2cx, P2cy,*/ distAB.lenX, distAB.lenY);
  
  bezierCubic( colour, Ax, Ay, P1cx, P1cy, P2cx, P2cy, Bx, By );
  
  setPixel(10, P1cx, P1cy, 0, 0);
  setPixel(6, P2cx, P2cy, 0, 0);

}

function scaleImage(scaleFactor) { 

  var scl = document.getElementById('a').getContext("2d");
  scl.imageSmoothingEnabled = false;
  scl.webkitImageSmoothingEnabled = false;
  scl.mozImageSmoothingEnabled = false;
  scl.drawImage(img, 0, 0, imgWidth, imgHeight);

  var ctx = document.getElementById('c').getContext("2d");
  ctx.imageSmoothingEnabled = false;
  ctx.webkitImageSmoothingEnabled = false;
  ctx.mozImageSmoothingEnabled = false;
  ctx.drawImage(img, 0, 0, imgWidth*pixelSize, imgHeight*pixelSize);

};

