const {parseColor,formatColor} = require('tailwindcss/lib/util/color');
const tailwindConfig = require('../tailwind.config');

function getNearestMatchingColor(color){
    let rgba = parseColor(color);
    rgba.alpha = 1;
    return formatColor(rgba)
}

function pxToEm(value){

}

module.exports = {getNearestMatchingColor,pxToEm}
