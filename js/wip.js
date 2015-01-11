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
	var min, max, delta, h, s, v;
	min = Math.min( r, g, b );
	max = Math.max( r, g, b );
	v = max;				     // v
	var delta = max - min;
	if( max != 0 ) {
		s = delta / max;		// s
    } else {
		// r = g = b = 0		// s = 0, v is undefined
		s = 0;
		h = 0 //-1;
		return {
          h: h,
          s: s,
          v: v
        };
	}
	if( r == max ) {
		h = ( g - b ) / delta;		// between yellow & magenta
    } else if ( g == max ) {
		h = 2 + ( b - r ) / delta;	// between cyan & yellow
    } else {
		h = 4 + ( r - g ) / delta;	// between magenta & cyan
	 h = h * 60;				// degrees
    }
      if( h < 0 )
		h += 360;
  return {
    h: h,
    s: s,
    v: v
  }
}

function HSVtoRGB( h, s, v )
{
	var i;
	var f, p, q, t, r, g, b;
	if( s == 0 ) {
		// achromatic (grey)
		r = g = b = v;
        return {
          r: r,
          g: g,
          b: b
        }
	}
	h /= 60;			// sector 0 to 5
	i = Math.floor( h );
	f = h - i;			// factorial part of h
	p = v * ( 1 - s );
	q = v * ( 1 - s * f );
	t = v * ( 1 - s * ( 1 - f ) );
	switch( i ) {
		case 0:
			r = v;
			g = t;
			b = p;
			break;
		case 1:
			r = q;
			g = v;
			b = p;
			break;
		case 2:
			r = p;
			g = v;
			b = t;
			break;
		case 3:
			r = p;
			g = q;
			b = v;
			break;
		case 4:
			r = t;
			g = p;
			b = v;
			break;
		default:		// case 5:
			r = v;
			g = p;
			b = q;
			break;
	}
  return {
    r: r,
    g: g,
    b: b
  }
}
