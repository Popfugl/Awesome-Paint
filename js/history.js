function undo() {
  if (historyStep == null) {
    // Undo has been pressed for the first time.
    historyStep = historyBuffer.length-1;
  }
  historyStep--;
  if (historyStep < 0) {historyStep = 0; return;}
  
  copyFromHistory();
  var toolHist = historyBuffer[historyStep+1].action.split(':',1);
  
  dbug('undo ' + toolHist);
}

function redo() {
  if (historyStep == null || historyStep == historyBuffer.length) {return;}
  
  historyStep++;
  if (historyStep > historyBuffer.length-1) {historyStep = historyBuffer.length-1; return;}
  
  copyFromHistory();
  var toolHist = historyBuffer[historyStep].action.split(':',1);
  
  dbug('redo ' + toolHist);
}

function copyFromHistory() {
  // dbug('History: '+historyStep);
  temp.drawImage(historyBuffer[historyStep].image, 0, 0);
  console.log( historyStep + ', ' + historyBuffer[historyStep].index );
  frame[historyBuffer[historyStep].index].pxl = historyBuffer[historyStep].pxl.slice(0);
  frame[historyBuffer[historyStep].index].pal = historyBuffer[historyStep].pal.slice(0);
  
  displayPalette();
  
  update = true;
}

function deleteFutureHistory(a) {
  // Split the array in two parts and only keep the first part, thus deleting the second.
  historyBuffer = historyBuffer.slice(0, a);
}

function getPalette() {
  var pal = [];
  for ( p = 0; p < frame[currentFrame].pal.length; p++ ) {
    pal.push ({
    r : parseInt( frame[currentFrame].pal[p].r ),
    g : parseInt( frame[currentFrame].pal[p].g ),
    b : parseInt( frame[currentFrame].pal[p].b ),
    a : parseInt( frame[currentFrame].pal[p].a )
    });
  }
  return pal;
}

function saveToHistoryBuffer(cmd){
  // save all data for the current frame
  // later it might be wise to only store the relevant change.
  var image = new Image();
  image.src = t.toDataURL("image/png");
  var pxl = [];
  var pal = getPalette();
  pxl = frame[currentFrame].pxl;
  pxl = pxl.slice(0);
  
  historyBuffer.push ({
    action: cmd,
    index: frame[currentFrame].index,
    pal: pal,
    pxl: pxl,
    timing: frame[currentFrame].timing,
    image: image
  });
  
  if (cmd) { dbug(cmd); }
  if (historyBuffer.length == historyLimit + 1) { del = historyBuffer.shift(); del = null;}
}

function getArray(a) {
  var b = [];
  for (i = 0; i < a.length; i++) {
    b[i] = a[i];
  }
  return b;
}

function parseCommandHistory() {
  CMDhistory = "draw  : 1|31,149;31,151;31,150;31,151;32,153;32,157;33,161;34,166;36,175;39,184;46,197;51,204;55,210;58,215;63,219;72,225;74,226;75,226;75,227\nline  : 1|153,30,134,88\ncurve : 1|112,130,90,211,151,175\n//colFG: 12\nfill  : 12|193,126\n//colFG: 19\nrect  : 19|206,84,257,235,false\ncircle: 19|110,111,146,160,false\nellipse: 19|177,126,232,140,false\nundo ellipse\nredo ellipse\ncls : 0";

  CMDhistory = "//initialising\n//colFG: 12\nfill  : 12|109,173\n//colFG: 6\nline  : 6|56,65,70,177\nline  : 6|70,177,195,208\nline  : 6|195,208,178,97\nline  : 6|178,97,56,65\ncurve : 6|56,65,178,97,109,48\nline  : 6|92,46,239,18\nline  : 6|178,97,286,46\nline  : 6|286,46,287,110\nline  : 6|287,110,195,208\ncurve : 6|239,18,286,46,271,26\n//colFG: 7\nfill  : 7|111,166\nfill  : 7|110,70\n//colFG: 8\nfill  : 8|205,142\n//colFG: 9\nfill  : 9|204,57";
  
  var CMDhistory = $('#input').val();
  CMDhistory = CMDhistory.split('\n');
  console.log(CMDhistory);
  
  while (CMDhistory.length) {
    update = true;
    
    var CMD = CMDhistory.shift();
    var save = CMD;
    CMD = CMD.replace(/ /g, '');
    CMD = CMD.split(':');
    
    // It's not a comment or an undo / redo
    if ( CMD.length == 2 ) {

      if ( CMD[0] == 'sketch' ) {
        CMD = CMD[1].split('|');
        var colour = CMD[0];
        activeColor = colour;
        
        CMD = CMD[1].split(';');
        
        while (CMD.length) {
          var crds = CMD.pop();
          crds = crds.split(',');
          setPixel(colour, parseInt( crds[0] ), parseInt( crds[1] ), frameNum);
        }
        saveToHistoryBuffer( save );
      }
      
      if ( CMD[0] == 'newCol' ) {
        CMD = CMD[1].split('|');
        var colIndex = parseInt( CMD[0] );
        colourChanged = colIndex;
        
        var colVals = CMD[1].split(',');
        var r = parseInt( colVals[0] );
        var g = parseInt( colVals[1] );
        var b = parseInt( colVals[2] );
        
        $('#redVal').val( r );
        $('#greenVal').val( g );
        $('#blueVal').val( b );
        
        updateRGBtoHSV();
//        updateHSVtoRGB();
        $('.applyChange').click();
        
        saveToHistoryBuffer( save );
      }
      
      if ( CMD[0] == 'curve' ) {
        CMD = CMD[1].split('|');
        var colour = CMD[0];
        activeColor = colour;
        
        var crds = CMD[1].split(',');
        curve( parseInt( crds[0] ), parseInt( crds[1] ), parseInt( crds[2] ), parseInt( crds[3] ), parseInt( crds[4] ), parseInt( crds[5] ) );
      }
      
      if ( CMD[0] == 'fill' ) {
        CMD = CMD[1].split('|');
        var colour = CMD[0];
        activeColor = colour;
        
        var crds = CMD[1].split(',');
        floodFill( colour, parseInt( crds[0] ), parseInt( crds[1] ) );
        saveToHistoryBuffer( save );
      }
      
      if ( CMD[0] == 'rect' ) {
        CMD = CMD[1].split('|');
        var colour = CMD[0];
        activeColor = colour;
        
        var crds = CMD[1].split(',');
        if ( crds[4] == "false" ) {var flag = false; } else { var flag = true; }
        rectangle( parseInt( crds[0] ), parseInt( crds[1] ), parseInt( crds[2] ), parseInt( crds[3] ), flag );
        saveToHistoryBuffer( save );
      }
      
      if ( CMD[0] == 'circle' ) {
        CMD = CMD[1].split('|');
        var colour = CMD[0];
        activeColor = colour;
        
        var crds = CMD[1].split(',');
        if ( crds[4] == "false" ) {var flag = false; } else { var flag = true; }
        circle( parseInt( crds[0] ), parseInt( crds[1] ), parseInt( crds[2] ), parseInt( crds[3] ), flag );
        saveToHistoryBuffer( save );
      }
      
      if ( CMD[0] == 'ellipse' ) {
        CMD = CMD[1].split('|');
        var colour = CMD[0];
        activeColor = colour;
        
        var crds = CMD[1].split(',');
        if ( crds[4] == "false" ) {var flag = false; } else { var flag = true; }
        ellipse( parseInt( crds[0] ), parseInt( crds[1] ), parseInt( crds[2] ), parseInt( crds[3] ), flag );
        saveToHistoryBuffer( save );
      }
      
      if ( CMD[0] == 'draw' || CMD[0] == 'line' ) {
        CMD = CMD[1].split('|');
        
        var colour = parseInt( CMD[0] );
        
        CMD = CMD[1].split(';');
        var crds, lastX, lastY;
        while (CMD.length) {
          activeColour = colour;
          crds = CMD.shift();
          crds = crds.split(',');
          
          // 2 sets of coords means it's a line.
          if ( crds.length == 4 ) {
            lastX = parseInt( crds[0] );
            lastY = parseInt( crds[1] );
            crds[0] = parseInt( crds[2] );
            crds[1] = parseInt( crds[3] );
          }
          if (lastX != null && lastY != null) {
            drawLine( lastX, lastY, parseInt( crds[0] ), parseInt( crds[1] ) );
          }
          lastX = parseInt( crds[0] );
          lastY = parseInt( crds[1] );
        }
        saveToHistoryBuffer( save );
      }
    } else { // The command is split by a comma, so it must be a cls, an undo or a redo.
    
      CMD = CMD[0].split(':');
      if ( CMD[0] == 'cls' ) {
        clearScreen( parseInt( CMD[1] ) );
        saveToHistoryBuffer( save );
      }

      // undo is part of the string, it will be changed and so we fire and undo()
      var checkUndo = CMD[0].replace(/undo/g,'');
      if ( checkUndo != CMD[0] ) {
        undo();
        saveToHistoryBuffer( save );
      }

      // same as with undo above
      var checkRedo = CMD[0].replace(/redo/g,'');
      if ( checkRedo != CMD[0] ) {
        redo();
        saveToHistoryBuffer( save );
      }
    }
  }
  $('#input').val('');
}

/*
backspace   8
tab     9
enter   13
shift   16
ctrl    17
alt     18
pause/break     19
caps lock   20
escape  27
page up     33
page down   34
end     35
home    36
left arrow  37
up arrow    38
right arrow     39
down arrow  40
insert  45
delete  46
0   48
1   49
2   50
3   51
4   52
5   53
6   54
7   55
8   56
9   57
a   65
b   66
c   67
d   68
e   69
f   70
g   71
h   72
i   73
j   74
k   75
l   76
m   77
n   78
o   79
p   80
q   81
r   82
s   83
t   84
u   85
v   86
w   87
x   88
y   89
z   90
left window key     91
right window key    92
select key  93
numpad 0    96
numpad 1    97
numpad 2    98
numpad 3    99
numpad 4    100
numpad 5    101
numpad 6    102
numpad 7    103
numpad 8    104
numpad 9    105
multiply    106
add     107
subtract    109
decimal point   110
divide  111
f1  112
f2  113
f3  114
f4  115
f5  116
f6  117
f7  118
f8  119
f9  120
f10     121
f11     122
f12     123
num lock    144
scroll lock     145
semi-colon  186
equal sign  187
comma   188
dash    189
period  190
forward slash   191
grave accent    192
open bracket    219
back slash  220
close braket    221
single quote    222
*/