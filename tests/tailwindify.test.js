const tailwindify = require('../tailwindify');
const fs = require('fs');
const {parseColor,formatColor} = require('tailwindcss/lib/util/color');
function readSourceToTargetConversion(filename){
    let source = fs.readFileSync('./tests/fixtures/'+filename+'.source.html',{encoding:'utf-8'});
    let css = fs.readFileSync('./tests/fixtures/'+filename+'.source.css',{encoding:'utf-8'});
    let target = fs.readFileSync('./tests/fixtures/'+filename+'.target.html',{encoding:'utf-8'});
    return {source,css,target}

}
test('simple html files',()=>{
    const {source,css,target} = readSourceToTargetConversion('inline-html')

    expect(tailwindify(source,css)).toBe(target);
})

test('tailwind color conversion works',()=>{
    // let rgba = parseColor('red');
    // rgba.alpha = 1;
    // expect(formatColor(rgba)).toEqual('red');
})
