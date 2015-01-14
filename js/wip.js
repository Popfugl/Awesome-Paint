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

// r,g,b values are from 0 to 1
// h = [0,360], s = [0,1], v = [0,1]
//		if s == 0, then h = -1 (undefined)
function RGBtoHSV( r, g, b )
{
    var rr, gg, bb,
        r = arguments[0] / 15,
        g = arguments[1] / 15,
        b = arguments[2] / 15,
        h, s,
        v = Math.max(r, g, b),
        diff = v - Math.min(r, g, b),
        diffc = function(c){
            return (v - c) / 6 / diff + 1 / 2;
        };

    if (diff == 0) {
        h = s = 0;
    } else {
        s = diff / v;
        rr = diffc(r);
        gg = diffc(g);
        bb = diffc(b);

        if (r === v) {
            h = bb - gg;
        }else if (g === v) {
            h = (1 / 3) + rr - bb;
        }else if (b === v) {
            h = (2 / 3) + gg - rr;
        }
        if (h < 0) {
            h += 1;
        }else if (h > 1) {
            h -= 1;
        }
    }
    return {
        h: Math.round(h * 360),
        s: Math.round(s * 100),
        v: Math.round(v * 100)
    };
}

function HSVtoRGBnice( h, s, v) {
  return {
    r: Math.ceil(HSVtoRGB( h, s, v ).r*15),
    g: Math.ceil(HSVtoRGB( h, s, v ).g*15),
    b: Math.ceil(HSVtoRGB( h, s, v ).b*15)
  }
}



function HSVtoRGB(h,s,v){
  //***Returns an rgb object from HSV values
  //***h (hue) should be a value from 0 to 360
  //***s (saturation) and v (value) should be a value between 0 and 1
  //***The .r, .g, and .b properties of the returned object are all in the range 0 to 1
  var r,g,b,i,f,p,q,t;
  while (h<0) h+=360;
  h%=360;
  s=s>1?1:s<0?0:s;
  v=v>1?1:v<0?0:v;

  if (s==0) {r=g=b=v;}
  else {
    h/=60;
    f=h-(i=Math.floor(h));
    p=v*(1-s);
    q=v*(1-s*f);
    t=v*(1-s*(1-f));
    switch (i) {
      case 0:r=v; g=t; b=p; break;
      case 1:r=q; g=v; b=p; break;
      case 2:r=p; g=v; b=t; break;
      case 3:r=p; g=q; b=v; break;
      case 4:r=t; g=p; b=v; break;
      case 5:r=v; g=p; b=q; break;
    }
  }

  return {
    r:parseFloat(r),
    g:parseFloat(g),
    b:parseFloat(b)
  };
}