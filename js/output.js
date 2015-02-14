// saving functionality borrowed from here:
// http://runnable.com/U5HC9xtufQpsu5aj/use-javascript-to-save-textarea-as-a-txt-file
function dumpFrameToText(num){
  if (!num){
    num = 0;
  }
  var textDump;
  var newLine     = "\n";
  var cmdHist     = $("#outputContainer #output").html().replace(/\/div>/g,'/div>EOL\n');
  cmdHist         = strip(cmdHist).replace(/\/\/initialisingEOL\n/g,'');
  cmdHist         = "cmdHist:" + newLine + cmdHist;
  var frmNum      = "Frame#:" + num + newLine;
  var palDump     = "Palette:" + newLine;
  var pxlDump     = "Pixels:" + newLine;
  var timing      = "Timing:" + frame[num].timing + newLine;;
  var pl          = frame[num].pal;
  var pxl         = frame[num].pxl;
  
  for (i = 0; i < pl.length; i++){
    palDump += pl[i].r + "," + pl[i].g + "," + pl[i].b  + "," + pl[i].a + ";";
  }
  palDump += newLine;
  
  var count = 0;
  for (i = 0; i < pxl.length; i++){
    pxlDump += pxl[i];
    if (count == imgWidth){
      count = 0;
      pxlDump += ",EOL\n";
    } else {
      count++;
      pxlDump += ",";
    }
  }
  pxlDump += newLine;
  textDump = cmdHist + frmNum + timing + palDump + pxlDump;
  
// create a new Blob (html5 magic) that conatins the data from your form feild
  var textFileAsBlob = new Blob([textDump], {type:'text/plain'});
// Specify the name of the file to be saved
  var fileNameToSaveAs = $('#saveFileName').val();
//  console.log(textDump);
  
// Optionally allow the user to choose a file name by providing 
// an imput field in the HTML and using the collected data here
// var fileNameToSaveAs = txtFileName.text;

// create a link for our script to 'click'
    var downloadLink = document.createElement("a");
//  supply the name of the file (from the var above).
// you could create the name here but using a var
// allows more flexability later.
    downloadLink.download = fileNameToSaveAs;
// provide text for the link. This will be hidden so you
// can actually use anything you want.
    downloadLink.innerHTML = "My Hidden Link";
    
// allow our code to work in webkit & Gecko based browsers
// without the need for a if / else block.
    window.URL = window.URL || window.webkitURL;
          
// Create the link Object.
    downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
// when link is clicked call a function to remove it from
// the DOM in case user wants to save a second file.
    downloadLink.onclick = destroyClickedElement;
// make sure the link is hidden.
    downloadLink.style.display = "none";
// add the link to the DOM
    document.body.appendChild(downloadLink);
    
// click the new link
    downloadLink.click();
}

function destroyClickedElement(event)
{
// remove the link from the DOM
    document.body.removeChild(event.target);
}

$(document).ready(function(){
  var zone = new FileDrop('loadDropContainer', {input: false});

  zone.event('upload', function (e) {
    zone.eventFiles(e).each(function (file) {
      file.readData(
        function (textDrop) {
          // var area = document.createElement('textarea');
          // area.value = str;
          // zone.el.appendChild(area);

        // Parse the textDrop
          textDrop = textDrop.replace(/EOL\n/g, 'EOL');
          textDrop = textDrop.replace(/cmdHist:\n/g, '');
          textDrop = textDrop.replace(/Frame#:/g, '');
          textDrop = textDrop.replace(/Palette:\n/g, '');
          textDrop = textDrop.replace(/Pixels:\n/g, '');
          textDrop = textDrop.replace(/Timing:/g, '');

          textDrop = textDrop.split('\n');
          var cmdHist = textDrop.shift();
          
          var cmdElement = cmdHist.split('EOL');
          var nill = cmdElement.pop()  // Remove empty index
          
          
          commandBuffer = [];
          while ( cmdElement.length ){
            dbug( cmdElement.shift() );
          }
          dbug('// Project loaded');

          var FrmNum = parseInt( textDrop.shift() );
          var Timing = parseFloat( textDrop.shift() );
          var palDump = textDrop.shift().replace(/EOL/g,'');
          var pxlDump = textDrop.shift().replace(/EOL/g,'');

          frame[FrmNum].timing = Timing;

          palDump = palDump.split(';');
          var nill = palDump.pop(); // Remove empty index

          var count = 0;
          while (palDump.length){
            var pl = palDump.shift();
            pl = pl.split(',');
            frame[FrmNum].pal[count].r = pl[0];
            frame[FrmNum].pal[count].g = pl[1];
            frame[FrmNum].pal[count].b = pl[2];
            frame[FrmNum].pal[count].a = pl[3];
            count++;
          }

          pxlDump = pxlDump.split(',');
          nill = pxlDump.pop(); // Remove empty index
          
          count = 0;
          while (pxlDump.length){
            if (!pxlDump.length){debugger;}
            var px = pxlDump.shift();
            frame[FrmNum].pxl[count] = px;
            count++;
          }
          updateScreen();
        },
        function () { alert('Problem reading this file.'); },
        'text'
      );
    });

  });

});

function strip(html)
{
   var tmp = document.createElement("DIV");
   tmp.innerHTML = html;
   return tmp.textContent || tmp.innerText || "";
}
// EOF
