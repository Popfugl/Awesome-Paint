function updatePalette(index, red, green, blue, alpha, frame) {
  palette.push({
    i: index,
    r: red,
    g: green,
    b: blue,
    a: alpha,
    f: frame
  });
}

function initRGBSliders ( index ) {
  $('#redSlider').val( frame[frameNum].pal[index].r);
  $('#greenSlider').val( frame[frameNum].pal[index].g);
  $('#blueSlider').val( frame[frameNum].pal[index].b);
  $('#redVal').val( frame[frameNum].pal[index].r);
  $('#greenVal').val( frame[frameNum].pal[index].g);
  $('#blueVal').val( frame[frameNum].pal[index].b);
  updateTempColour();
}

function setColour( index ) {
  activeColour = index;
  $ctx.fillStyle = 'rgba('
  + palIndex12to24bit(index).r + ','
  + palIndex12to24bit(index).g + ','
  + palIndex12to24bit(index).b + ','
  + palIndex12to24bit(index).a + ')';
  temp.fillStyle = $ctx.fillStyle;
  return $ctx.fillStyle;
}

function palIndex12to24bit(index) {
  var r = palette[index].r;
  var g = palette[index].g;
  var b = palette[index].b;
  var a = palette[index].a;
  
  r = palValue12to24bit(r);
  g = palValue12to24bit(g);
  b = palValue12to24bit(b);
  a = palValue12to24bit(a);
  
  return {
    i: index,
    r: r,
    g: g,
    b: b,
    a: a
  };
}

function palValue12to24bit(value) {
  if (value > 15) {return null;}
  return (value*16)+parseInt(value);
}

function getColour(x, y){
  if (!preview) { console.log(',:'+x,y,frameNum); }
  if (x < 0 || y < 0 || x >= imgWidth || y >= imgHeight)
  {
    // perhaps use this to get the colour of an outside object? Like the UI?
    return null;
  }
  gv = frame[frameNum].pxl[y*(imgWidth)+x];
  //if (!gv && gv ) {return null;}
  
  return gv;
}

function initPalette(choice) {
  switch (choice) {
    case 0:
    // 2 colours:
    updatePalette( 0, 0, 0, 0,15,0); // black
    updatePalette( 1,15,15,15,15,0); // white
    break;
  
    case 1:
    // 4 colours:
    updatePalette( 0, 0, 0, 0,15,0); // black
    updatePalette( 1,14,12,10,15,0); // beige
    updatePalette( 2, 5, 5,15,15,0); // bluish
    updatePalette( 3,15, 8, 0,15,0); // Orange
    break;
  
    case 2:
    // 8 colours:
    updatePalette( 0, 0, 0, 0,15,0); // black
    updatePalette( 1,14,12,10,15,0); // beige
    updatePalette( 2,11, 0, 0,15,0); // red
    updatePalette( 3, 0, 8, 0,15,0); // green
    updatePalette( 4, 2, 4,13,15,0); // blue
    updatePalette( 5,14,11, 0,15,0); // warm yellow
    updatePalette( 6,11, 5, 2,15,0); // dark orange
    updatePalette( 7, 0,12,12,15,0); // turqoise
    break;
  
    case 3:
    // 16 colours:
    updatePalette( 0, 0, 0, 0,15,0); // black
    updatePalette( 1,14,12,10,15,0); // beige
    updatePalette( 2,12, 0, 0,15,0); // darkish red
    updatePalette( 3,15, 6, 0,15,0); // orange
    updatePalette( 4, 0, 9, 0,15,0); // dark green
    updatePalette( 5, 3,15, 1,15,0); // bright green
    updatePalette( 6, 0, 0,15,15,0); // blue
    updatePalette( 7, 2,13,14,15,0); // turqoise-ish
    updatePalette( 8,15, 0,13,15,0); // magenta
    updatePalette( 9,10, 0,15,15,0); // purple
    updatePalette(10, 9, 5, 0,15,0); // brown
    updatePalette(11,15,13,10,15,0); // skin
    updatePalette(12,15,14, 0,15,0); // yellow
    updatePalette(13,13,13,13,15,0); // light grey
    updatePalette(14, 8, 8, 8,15,0); // grey
    updatePalette(15, 4, 4, 4,15,0); // dark grey
    break;
  
    case 4:
    // 32 colours:
    updatePalette( 0, 0, 0, 0,15,0); // black
    updatePalette( 1,14,12,10,15,0); // beige
    updatePalette( 2,14, 0, 0,15,0); // red
    updatePalette( 3,10, 0, 0,15,0); // dark red
    updatePalette( 4,13, 8, 0,15,0); // orange
    updatePalette( 5,15,14, 0,15,0); // yellow
    updatePalette( 6, 8,15, 0,15,0); // bright green
    updatePalette( 7, 0, 8, 0,15,0); // darker green
    updatePalette( 8, 0,11, 6,15,0); // muddy green
    updatePalette( 9, 0,13,13,15,0); // greenish blue
    updatePalette(10, 0,10,15,15,0); // ocean blue
    updatePalette(11, 0, 7,12,15,0); // dark ocean blue
    updatePalette(12, 0, 0,15,15,0); // blue
    updatePalette(13, 7, 0,15,15,0); // purple
    updatePalette(14,12, 0,14,15,0); // magenta
    updatePalette(15,12, 0, 8,15,0); // dark purple
    updatePalette(16, 6, 2, 0,15,0); // dark brown
    updatePalette(17,14, 5, 2,15,0); // orangy brown
    updatePalette(18,10, 5, 2,15,0); // light brown
    updatePalette(19,15,12,10,15,0); // fucking close to beige
    updatePalette(20, 3, 3, 3,15,0); // Greyscales
    updatePalette(21, 4, 4, 4,15,0);
    updatePalette(22, 5, 5, 5,15,0);
    updatePalette(23, 6, 6, 6,15,0);
    updatePalette(24, 7, 7, 7,15,0);
    updatePalette(25, 8, 8, 8,15,0);
    updatePalette(26, 9, 9, 9,15,0);
    updatePalette(27,10,10,10,15,0);
    updatePalette(28,12,12,12,15,0);
    updatePalette(29,13,13,13,15,0);
    updatePalette(30,14,14,14,15,0);
    updatePalette(31,15,15,15,15,0); // white
    break;
  
    case 5:
    // Halfbrite first 32 colours:
    updatePalette( 0, 0, 0, 0,15,0); // black
    updatePalette( 1,14,12,10,15,0); // beige
    updatePalette( 2,15, 0, 0,15,0); // red
    updatePalette( 3,12, 0, 0,15,0); // dark red
    updatePalette( 4,10, 0, 0,15,0); // darker red
    updatePalette( 5, 0,13, 0,15,0); // green
    updatePalette( 6, 0,10, 0,15,0); // dark green
    updatePalette( 7, 0, 8, 0,15,0); // darker green
    updatePalette( 8, 0, 0,15,15,0); // Blue
    updatePalette( 9, 0, 0,12,15,0); // dark blue
    updatePalette(10, 0, 0,10,15,0); // darker blue
    updatePalette(11,15,15, 4,15,0); // yellow
    updatePalette(12,12,12, 1,15,0); // dark yellow
    updatePalette(13, 9, 9, 1,15,0); // darker yellow
    updatePalette(14, 0,15,15,15,0); // 
    updatePalette(15, 0,11,11,15,0); // dark
    updatePalette(16, 0, 9, 9,15,0); // darker
    updatePalette(17,15, 0, 9,15,0); // pink
    updatePalette(18,13, 0, 7,15,0); // dark pink
    updatePalette(19, 9, 0, 6,15,0); // darker pink
    updatePalette(20,13, 4, 1,15,0);
    updatePalette(21,10, 3, 1,15,0);
    updatePalette(22, 8, 2, 1,15,0);
    updatePalette(23, 0, 9,15,15,0);
    updatePalette(24, 0, 6,12,15,0);
    updatePalette(25, 0, 4, 9,15,0);
    updatePalette(26, 1,12, 8,15,0);
    updatePalette(27, 1, 9, 6,15,0);
    updatePalette(28, 4, 7, 5,15,0);
    updatePalette(29,15,15,15,15,0); // white
    updatePalette(30,12,12,12,15,0); // light grey
    updatePalette(31, 9, 9, 9,15,0); // grey
    break;
  }
}

function displayPalette(){
  for (p = 0; p < palette.length; p++)
  {
    var red = palIndex12to24bit(p).r;
    var green = palIndex12to24bit(p).g;
    var blue = palIndex12to24bit(p).b;
    $('#palette').html($('#palette').html()+'<span class="palIndex" id="palIndex'+p+'" style="background-color: rgb('+red+','+green+','+blue+')">'+p+'</span>');
  }
  a = imgPixelWidth;
  b = palette.length;
  c = a/b;
  
//  console.log(a,b,c);
  $('.palIndex').width(c-2).height(18); // for some reason the buttons are added 12 pixels.
  $('#palette').width(a).height(20).css('border',pixelSize);
  
  var red = palIndex12to24bit(colFG).r;
  var green = palIndex12to24bit(colFG).g;
  var blue = palIndex12to24bit(colFG).b;
  
  var redBG = palIndex12to24bit(colBG).r;
  var greenBG = palIndex12to24bit(colBG).g;
  var blueBG = palIndex12to24bit(colBG).b;
    
  $('.palIndex').css('border-color','rgb('+redBG+','+greenBG+','+blueBG+')');
  $('#foregroundColour').css('background-color','rgb('+red+','+green+','+blue+')');
  $('#backgroundColour').css('background-color','rgb('+redBG+','+greenBG+','+blueBG+')');
}

////////////////////
// OnClick Event! //
////////////////////
$(document).ready(function() {
  
  // RGB Sliders
  $( ".rgbSlider" ).slider({
      range:false,
      min: 0,
      max: 15
  });
  $( "#redSlider" ).slider({
      slide: function( event, ui ){
        $('#redVal').val( ui.value ); 
        updateTempColour();
      }
  });
  
  $( "#greenSlider" ).slider({
      slide: function(event,ui){
        $('#greenVal').val(ui.value);
        updateTempColour();
      }
  });
  $( "#blueSlider" ).slider({
      slide: function(event,ui){
        $('#blueVal').val(ui.value);
        updateTempColour();
      }
  });
  
  // RGB text-input
  $('#redVal').change( function () {
    $('#redSlider').slider({
      value: $(this).val()
    })
    updateTempColour();
  });

  $('#greenVal').change( function () {
    $('#greenSlider').slider({
      value: $(this).val()
    })
    updateTempColour();
  });

  $('#blueVal').change( function () {
    $('#blueSlider').slider({
      value: $(this).val()
    })
    updateTempColour();
  });

});

function updateTempColour() {
  var red = palValue12to24bit( $('#redVal').val() );
  var green = palValue12to24bit( $('#greenVal').val() );
  var blue = palValue12to24bit( $('#blueVal').val() );
  
  // Update the sliders
  $('#redSlider').slider({
    value: $('#redVal').val()
  })
  $('#greenSlider').slider({
    value: $('#greenVal').val()
  })
  $('#blueSlider').slider({
    value: $('#blueVal').val()
  })

  $('#tempColour').css('background-color','rgb('+red+','+green+','+blue+')');
}