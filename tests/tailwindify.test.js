const tailwindify = require('../tailwindify');
const fs = require('fs');
const prettify = require('html-prettify');
function readSourceToTargetConversion(filename){
    let source = fs.readFileSync('./tests/fixtures/'+filename+'.source.html',{encoding:'utf-8'});
    let css = fs.readFileSync('./tests/fixtures/'+filename+'.source.css',{encoding:'utf-8'});
    let target = fs.readFileSync('./tests/fixtures/'+filename+'.target.html',{encoding:'utf-8'});
    return {source,css,target}

}
test('simple html files',()=>{
    let {source,css,target} = readSourceToTargetConversion('inline-html')
    let result = tailwindify(source,css);
    result = prettify(result);
    target = prettify(target);
    expect(result).toBe(target);
})

