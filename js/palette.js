function updateInitPalette( index, red, green, blue, alpha, frameNum) {
  frame[0].pal.push({
    r: red,
    g: green,
    b: blue,
    a: alpha
  });
}

function initRGBSliders ( index ) {
  var r = frame[frameNum].pal[index].r;
  var g = frame[frameNum].pal[index].g;
  var b = frame[frameNum].pal[index].b;
  
  $('#redSlider').val   ( r );
  $('#greenSlider').val ( g );
  $('#blueSlider').val  ( b );
  
  $('#redVal').val      ( r );
  $('#greenVal').val    ( g );
  $('#blueVal').val     ( b );
  
  updateRGBtoHSV();
}

function setColour( index ) {
  activeColour = index;
  $imgTempCtx.fillStyle = 'rgba('
  + palIndex12to24bit(index).r + ','
  + palIndex12to24bit(index).g + ','
  + palIndex12to24bit(index).b + ','
  + palIndex12to24bit(index).a + ')';
  
  $ovrTempCtx.fillStyle = $imgTempCtx.fillStyle;
  
  return $imgTempCtx.fillStyle;
}

function palIndex12to24bit( index ) {
  var r = frame[frameNum].pal[index].r;
  var g = frame[frameNum].pal[index].g;
  var b = frame[frameNum].pal[index].b;
  var a = frame[frameNum].pal[index].a;
  
  r = palValue12to24bit(r);
  g = palValue12to24bit(g);
  b = palValue12to24bit(b);
  a = palValue12to24bit(a);
  
  return {
    r: r,
    g: g,
    b: b,
    a: a
  };
}

function palValue12to24bit( value ) {
  if ( value > 15 ) { return null; }
  return ( value * 16 ) + parseInt ( value );
}

function getColour( x, y ){
  if ( !preview ) { console.log(',:' + x, y, frameNum ); }
  if ( x < 0 || y < 0 || x >= imgWidth || y >= imgHeight )
  {
    // perhaps use this to get the colour of an outside object? Like the UI?
    return null;
  }
  colourIndex = frame[frameNum].pxl[y * ( imgWidth ) + x];
  //if (!gv && gv ) {return null;}
  
  return parseInt( colourIndex );
}

function initPalette(choice) {
  switch (choice) {
    case 0:
    // 2 colours:
    updateInitPalette( 0, 0, 0, 0,15,0); // black
    updateInitPalette( 1,15,15,15,15,0); // white
    break;
  
    case 1:
    // 4 colours:
    updateInitPalette( 0, 0, 0, 0,15,0); // black
    updateInitPalette( 1,14,12,10,15,0); // beige
    updateInitPalette( 2, 5, 5,15,15,0); // bluish
    updateInitPalette( 3,15, 8, 0,15,0); // Orange
    break;
  
    case 2:
    // 8 colours:
    updateInitPalette( 0, 0, 0, 0,15,0); // black
    updateInitPalette( 1,14,12,10,15,0); // beige
    updateInitPalette( 2,11, 0, 0,15,0); // red
    updateInitPalette( 3, 0, 8, 0,15,0); // green
    updateInitPalette( 4, 2, 4,13,15,0); // blue
    updateInitPalette( 5,14,11, 0,15,0); // warm yellow
    updateInitPalette( 6,11, 5, 2,15,0); // dark orange
    updateInitPalette( 7, 0,12,12,15,0); // turqoise
    break;
  
    case 3:
    // 16 colours:
    updateInitPalette( 0, 0, 0, 0,15,0); // black
    updateInitPalette( 1,14,12,10,15,0); // beige
    updateInitPalette( 2,12, 0, 0,15,0); // darkish red
    updateInitPalette( 3,15, 6, 0,15,0); // orange
    updateInitPalette( 4, 0, 9, 0,15,0); // dark green
    updateInitPalette( 5, 3,15, 1,15,0); // bright green
    updateInitPalette( 6, 0, 0,15,15,0); // blue
    updateInitPalette( 7, 2,13,14,15,0); // turqoise-ish
    updateInitPalette( 8,15, 0,13,15,0); // magenta
    updateInitPalette( 9,10, 0,15,15,0); // purple
    updateInitPalette(10, 9, 5, 0,15,0); // brown
    updateInitPalette(11,15,13,10,15,0); // skin
    updateInitPalette(12,15,14, 0,15,0); // yellow
    updateInitPalette(13,13,13,13,15,0); // light grey
    updateInitPalette(14, 8, 8, 8,15,0); // grey
    updateInitPalette(15, 4, 4, 4,15,0); // dark grey
    break;
  
    case 4:
    // 32 colours:
    updateInitPalette( 0, 0, 0, 0,15,0); // black
    updateInitPalette( 1,14,12,10,15,0); // beige
    updateInitPalette( 2,14, 0, 0,15,0); // red
    updateInitPalette( 3,10, 0, 0,15,0); // dark red
    updateInitPalette( 4,13, 8, 0,15,0); // orange
    updateInitPalette( 5,15,14, 0,15,0); // yellow
    updateInitPalette( 6, 8,15, 0,15,0); // bright green
    updateInitPalette( 7, 0, 8, 0,15,0); // darker green
    updateInitPalette( 8, 0,11, 6,15,0); // muddy green
    updateInitPalette( 9, 0,13,13,15,0); // greenish blue
    updateInitPalette(10, 0,10,15,15,0); // ocean blue
    updateInitPalette(11, 0, 7,12,15,0); // dark ocean blue
    updateInitPalette(12, 0, 0,15,15,0); // blue
    updateInitPalette(13, 7, 0,15,15,0); // purple
    updateInitPalette(14,12, 0,14,15,0); // magenta
    updateInitPalette(15,12, 0, 8,15,0); // dark purple
    updateInitPalette(16, 6, 2, 0,15,0); // dark brown
    updateInitPalette(17,14, 5, 2,15,0); // orangy brown
    updateInitPalette(18,10, 5, 2,15,0); // light brown
    updateInitPalette(19,15,12,10,15,0); // fucking close to beige
    updateInitPalette(20, 3, 3, 3,15,0); // Greyscales
    updateInitPalette(21, 4, 4, 4,15,0);
    updateInitPalette(22, 5, 5, 5,15,0);
    updateInitPalette(23, 6, 6, 6,15,0);
    updateInitPalette(24, 7, 7, 7,15,0);
    updateInitPalette(25, 8, 8, 8,15,0);
    updateInitPalette(26, 9, 9, 9,15,0);
    updateInitPalette(27,10,10,10,15,0);
    updateInitPalette(28,12,12,12,15,0);
    updateInitPalette(29,13,13,13,15,0);
    updateInitPalette(30,14,14,14,15,0);
    updateInitPalette(31,15,15,15,15,0); // white
    break;
  
    case 5:
    // Halfbrite first 32 colours:
    updateInitPalette( 0, 0, 0, 0,15,0); // black
    updateInitPalette( 1,14,12,10,15,0); // beige
    updateInitPalette( 2,15, 0, 0,15,0); // red
    updateInitPalette( 3,12, 0, 0,15,0); // dark red
    updateInitPalette( 4,10, 0, 0,15,0); // darker red
    updateInitPalette( 5, 0,13, 0,15,0); // green
    updateInitPalette( 6, 0,10, 0,15,0); // dark green
    updateInitPalette( 7, 0, 8, 0,15,0); // darker green
    updateInitPalette( 8, 0, 0,15,15,0); // Blue
    updateInitPalette( 9, 0, 0,12,15,0); // dark blue
    updateInitPalette(10, 0, 0,10,15,0); // darker blue
    updateInitPalette(11,15,15, 4,15,0); // yellow
    updateInitPalette(12,12,12, 1,15,0); // dark yellow
    updateInitPalette(13, 9, 9, 1,15,0); // darker yellow
    updateInitPalette(14, 0,15,15,15,0); // 
    updateInitPalette(15, 0,11,11,15,0); // dark
    updateInitPalette(16, 0, 9, 9,15,0); // darker
    updateInitPalette(17,15, 0, 9,15,0); // pink
    updateInitPalette(18,13, 0, 7,15,0); // dark pink
    updateInitPalette(19, 9, 0, 6,15,0); // darker pink
    updateInitPalette(20,13, 4, 1,15,0);
    updateInitPalette(21,10, 3, 1,15,0);
    updateInitPalette(22, 8, 2, 1,15,0);
    updateInitPalette(23, 0, 9,15,15,0);
    updateInitPalette(24, 0, 6,12,15,0);
    updateInitPalette(25, 0, 4, 9,15,0);
    updateInitPalette(26, 1,12, 8,15,0);
    updateInitPalette(27, 1, 9, 6,15,0);
    updateInitPalette(28, 4, 7, 5,15,0);
    updateInitPalette(29,15,15,15,15,0); // white
    updateInitPalette(30,12,12,12,15,0); // light grey
    updateInitPalette(31, 9, 9, 9,15,0); // grey
    break;
  }
}

function displayPalette(){
  $('#palette').html('');
  for (p = 0; p < frame[frameNum].pal.length; p++)
  {
    var red = palIndex12to24bit(p).r;
    var green = palIndex12to24bit(p).g;
    var blue = palIndex12to24bit(p).b;
    $('#palette').html($('#palette').html()+'<span class="palIndex" id="palIndex' + p + '" style="background-color: rgb(' + red + ',' + green + ',' + blue + ')">' + p + '</span>');
  }
  a = imgPixelWidth;
  b = frame[frameNum].pal.length;
  c = a/b;
  
  $('.palIndex').width( c - 2 ).height( 18 );
  $('#fgActive').width( c - 4 ).height( 15 ).css( 'margin', 2 );
  $('#bgActive').width( c - 4 ).height( 16 );
  $('#palette').width( a ).height( 20 ).css( 'border', pixelSize );
  
  var red = palIndex12to24bit(colFG).r;
  var green = palIndex12to24bit(colFG).g;
  var blue = palIndex12to24bit(colFG).b;
  
  var redBG = palIndex12to24bit(colBG).r;
  var greenBG = palIndex12to24bit(colBG).g;
  var blueBG = palIndex12to24bit(colBG).b;

  $('.palIndex').css('border-color','rgb(' + redBG + ',' + greenBG + ',' + blueBG + ')');
  $('#foregroundColour').css('background-color','rgb(' + red + ',' + green + ',' + blue + ')');
  $('#backgroundColour').css('background-color','rgb(' + redBG + ',' + greenBG + ',' + blueBG + ')');
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

  $( "#hueSlider" ).slider({
      range:false,
      min: 0.0,
      max: 360,
      step: 1
  });
  
  $( "#satSlider" ).slider({
      range:false,
      min: 0.00,
      max: 1.00,
      step: parseFloat(1/15)
  });
  
  $( "#valSlider" ).slider({
      range:false,
      min: 0.00,
      max: 1.00,
      step: parseFloat(1/15)
  });

  $( "#hueSlider" ).slider({
      slide: function( event, ui ){
        $('#hueVal').val( ui.value ); 
        updateHSVtoRGB();
      }
  });
  
  $( "#satSlider" ).slider({
      slide: function(event,ui){
        $('#satVal').val( ui.value );
        updateHSVtoRGB();
      }
  });
  $( "#valSlider" ).slider({
      slide: function(event,ui){
        $('#valVal').val( ui.value );
        updateHSVtoRGB();
      }
  });
  
  $( "#redSlider" ).slider({
      slide: function( event, ui ){
        $('#redVal').val( ui.value ); 
        updateRGBtoHSV();
      }
  });
  
  $( "#greenSlider" ).slider({
      slide: function(event,ui){
        $('#greenVal').val( ui.value );
        updateRGBtoHSV();
      }
  });
  $( "#blueSlider" ).slider({
      slide: function(event,ui){
        $('#blueVal').val( ui.value );
        updateRGBtoHSV();
      }
  });
  
  // RGB text-input
  $('#hueVal').change( function () {
    $('#hueSlider').slider({
      value: $(this).val()
    })
    updateHSVtoRGB();
  });

  $('#satVal').change( function () {
    $('#satSlider').slider({
      value: $(this).val()
    })
    updateHSVtoRGB();
  });

  $('#valVal').change( function () {
    $('#valSlider').slider({
      value: $(this).val()
    })
    updateHSVtoRGB();
  });
  
    // RGB text-input
  $('#redVal').change( function () {
    $('#redSlider').slider({
      value: $(this).val()
    })
    updateRGBtoHSV();
  });

  $('#greenVal').change( function () {
    $('#greenSlider').slider({
      value: $(this).val()
    })
    updateRGBtoHSV();
  });

  $('#blueVal').change( function () {
    $('#blueSlider').slider({
      value: $(this).val()
    })
    updateRGBtoHSV();
  });

  $('#foregroundColour').click( function () {
    colourChanged = activeColour = colFG;
    updatePaletteSelection();
  } );
  
  $('#backgroundColour').click( function () {
    colourChanged = activeColour = colBG;
    updatePaletteSelection();
  } );
  
});

function updateHSVtoRGB() {
  var h = $('#hueVal').val();
  var s = $('#satVal').val();
  var v = $('#valVal').val();
  
  var rgb = HSVtoRGBnice( h, s, v );
  
  $('#redVal').val( Math.ceil(rgb.r) );
  $('#greenVal').val( Math.ceil(rgb.g) );
  $('#blueVal').val( Math.ceil(rgb.b) );
  
  updateTempColour();
}

function updateRGBtoHSV() {
  var r = $('#redVal').val();
  var g = $('#greenVal').val();
  var b = $('#blueVal').val();
  var red = palValue12to24bit( r );
  var green = palValue12to24bit( g );
  var blue = palValue12to24bit( b );
  var hsv = RGBtoHSV( r, g, b );
  h = hsv.h;
  s = parseFloat(hsv.s/100);
  v = parseFloat(hsv.v/100);
  
  // Update the sliders
  $('#hueSlider').slider({
    value: h
  });
  $('#satSlider').slider({
    value: s
  });
  $('#valSlider').slider({
    value: v
  });
  $('#hueVal').val(h);
  $('#satVal').val(s);
  $('#valVal').val(v);
  
  updateTempColour()
}

function updateTempColour() {
  var r = $('#redVal').val();
  var g = $('#greenVal').val();
  var b = $('#blueVal').val();
  var red = palValue12to24bit( r );
  var green = palValue12to24bit( g );
  var blue = palValue12to24bit( b );
  $('#redSlider').slider({
    value: r
  })
  $('#greenSlider').slider({
    value: g
  })
  $('#blueSlider').slider({
    value: b
  })

  $('#tempColour').css('background-color','rgb('+red+','+green+','+blue+')');
}

function updatePaletteSelection() {
  var red     = palIndex12to24bit( colFG ).r;
  var green   = palIndex12to24bit( colFG ).g;
  var blue    = palIndex12to24bit( colFG ).b;

  var redBG   = palIndex12to24bit( colBG ).r;
  var greenBG = palIndex12to24bit( colBG ).g;
  var blueBG  = palIndex12to24bit( colBG ).b;

  if ( colFG == colourChanged ) {
    $('#foregroundColour').addClass('active');
    $('#backgroundColour').removeClass('active');
    $('#palIndex'+activeColour).css('border-color','rgb(' + red + ',' + green + ',' + blue + ')');
    $('#palIndex'+activeColour).css('background-color','rgb(' + red + ',' + green + ',' + blue + ')');
    $('#fgActive').css('left', activeColour * ( $('#palIndex0').width() + 2 ) );
  } else {
    $('#foregroundColour').removeClass('active');
    $('#backgroundColour').addClass('active');
    $('#palIndex'+activeColour).css('border-color','rgb(' + redBG + ',' + greenBG + ',' + blueBG + ')');
    $('#palIndex'+activeColour).css('background-color','rgb(' + redBG + ',' + greenBG + ',' + blueBG + ')');
    $('#bgActive').css('left', activeColour * ( $('#palIndex0').width() + 2 ) );
  }

  $('.palIndex').css( 'border-color', 'black' );
  
  $('#foregroundColour').css( 'background-color', 'rgb(' + red + ',' + green + ',' + blue + ')');
  $('#backgroundColour').css( 'background-color', 'rgb(' + redBG + ',' + greenBG + ',' + blueBG + ')');

  updateTempColour();
  initRGBSliders ( activeColour );
}

