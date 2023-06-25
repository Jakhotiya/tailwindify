const {parseColor,formatColor} = require('tailwindcss/lib/util/color');

function getNearestMatchingColor(color){
    let rgba = parseColor('red');
    rgba.alpha = 1;
    return formatColor(rgba)
}

function pxToEm(value){

}
