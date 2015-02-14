function point(x, y) {
  return {'x':x, 'y': y}
}

//////////////////
// Bezier Cubic //
//////////////////
function bezierPointCubic(P0, P1, P2, P3, t) {
  var x = (1.0-t) * (1.0-t) * (1.0-t) * P0.x + 3.0 * (1.0-t) * (1.0-t) * t * P1.x + 3.0 * (1.0-t) * t * t * P2.x + t * t * t * P3.x;
  var y = (1.0-t) * (1.0-t) * (1.0-t) * P0.y + 3.0 * (1.0-t) * (1.0-t) * t * P1.y + 3.0 * (1.0-t) * t * t * P2.y + t * t * t * P3.y;
  return point(x, y);
}

function bezierDirectionCubic(P0, P1, P2, P3, t) {
  var x = 3.0 * (1.0-t) * (1.0-t) * (P1.x - P0.x) + 6.0 * (t-1.0) * t * (P2.x - P1.x) + 3 * t * t * (P3.x - P2.x);
  var y = 3.0 * (1.0-t) * (1.0-t) * (P1.y - P0.y) + 6.0 * (t-1.0) * t * (P2.y - P1.y) + 3 * t * t * (P3.y - P2.y);
  return point(x, y);
}

function bezierSpeedCubic(P0, P1, P2, P3, t) {
  var dir = bezierDirectionCubic(P0, P1, P2, P3, t);
  return Math.sqrt(dir.x*dir.x + dir.y*dir.y);
}

function roundedNeighbours(pt1, pt2) {
  return Math.abs(Math.round(pt1.x) - Math.round(pt2.x)) <= 1.0 &&
         Math.abs(Math.round(pt1.y) - Math.round(pt2.y)) <= 1.0;
}

function bezierCubic(colour, P0x, P0y, P1x, P1y, P2x, P2y, P3x, P3y, preview) {
  var P0 = point(P0x, P0y);
  var P1 = point(P1x, P1y);
  var P2 = point(P2x, P2y);
  var P3 = point(P3x, P3y);

  var t = 0;
  while(t <= 1.0) {
    // draw point at current position
    var pt = bezierPointCubic(P0, P1, P2, P3, t);
    var x = Math.round(pt.x);
    var y = Math.round(pt.y);
    setPixel( activeColour, x, y, 0, t, preview, false );

    var speed = bezierSpeedCubic(P0, P1, P2, P3, t);
    var dt = 0.50 / speed;

    // try to increase t to step as far forward as possible, until the point on the bezier is no longer
    // neighbour to the point just drawn.
    var nextT = t + dt;
    var nextPt = bezierPointCubic(P0, P1, P2, P3, nextT);
    do {
      t = nextT;
      nextT += 0.1 * dt;
      nextPt = bezierPointCubic(P0, P1, P2, P3, nextT);
    } while(roundedNeighbours(pt, nextPt));
  }
}

//////////////////////
// Bezier Quadratic //
//////////////////////
function bezierPoint(P0, P1, P2, t) {
  var x = (1.0-t) * (1.0-t) * P0.x + 2.0 * (1.0 - t)*t*P1.x + t*t*P2.x;
  var y = (1.0-t) * (1.0-t) * P0.y + 2.0 * (1.0 - t)*t*P1.y + t*t*P2.y;
  return point(x, y);
}

function bezierDirection(P0, P1, P2, t) {
  var x = 2.0 * (1.0 - t) * (P1.x - P0.x) + 2.0 * t * (P2.x - P1.x);
  var y = 2.0 * (1.0 - t) * (P1.y - P0.y) + 2.0 * t * (P2.y - P1.y);
  return point(x, y);
}

function bezierSpeed(P0, P1, P2, t) {
  var dir = bezierDirection(P0, P1, P2, t);
  return Math.sqrt(dir.x*dir.x + dir.y*dir.y);
}

function roundedNeighbours(pt1, pt2) {
  return Math.abs(Math.round(pt1.x) - Math.round(pt2.x)) <= 1.0 &&
         Math.abs(Math.round(pt1.y) - Math.round(pt2.y)) <= 1.0;
}

function bezier( P0x, P0y, P1x, P1y, P2x, P2y, preview ) {
  var P0 = point(P0x, P0y);
  var P1 = point(P1x, P1y);
  var P2 = point(P2x, P2y);

  var t = 0;
  var loopcount=0;
  var rtcount = 0;
  while(t <= 1.0) {
    loopcount++;
    // draw point at current position
    var pt = bezierPoint(P0, P1, P2, t);
    var x = Math.round(pt.x);
    var y = Math.round(pt.y);
    setPixel( activeColour, x, y, 0, t, preview, false );

    var speed = bezierSpeed(P0,P1,P2, t);
    var dt = 0.95 / speed;

    // try to increase t to step as far forward as possible, until the point on the bezier is no longer
    // neighbour to the pt just drawn.
    var nextT = t + dt;
    var nextPt = bezierPoint(P0, P1, P2, nextT);
    do {
      rtcount++;
      t = nextT;
      nextT += 1 * dt;
      nextPt = bezierPoint(P0, P1, P2, nextT);
    } while(roundedNeighbours(pt, nextPt));
  }
  // console.log(loopcount, rtcount, preview);
  setPixel( activeColour, P2x, P2y, 0, 1, preview, false );
}
