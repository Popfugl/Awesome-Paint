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
  if (historyStep == null) {return;}
  historyStep++;
  if (historyStep > historyBuffer.length-1) {historyStep = historyBuffer.length-1; return;}
  copyFromHistory();
  var toolHist = historyBuffer[historyStep].action.split(':',1);
  dbug('redo ' + toolHist);
}

function copyFromHistory() {
  // dbug('History: '+historyStep);
  temp.drawImage(historyBuffer[historyStep].image, 0, 0);
  frame[historyBuffer[historyStep].index].pxl = historyBuffer[historyStep].pxl.slice(0);
  update = true;
}

function deleteFutureHistory(a) {
  // Split the array in two parts and only keep the first part, thus deleting the second.
  historyBuffer = historyBuffer.slice(0, a);
}

function saveToHistoryBuffer(cmd){
  // save all data for the current frame
  // later it might be wise to only store the relevant change.
  var image = new Image();
  image.src = t.toDataURL("image/png");
  var pxl = [];
  var pal = [];
  pxl = frame[currentFrame].pxl;
  pxl = pxl.slice(0);
  pal = frame[currentFrame].pal.slice(0);
  
  historyBuffer.push ({
    action: cmd,
    index: frame[currentFrame].index,
    palette: pal,
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