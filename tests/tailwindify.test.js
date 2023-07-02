const tailwindify = require('../tailwindify');
const fs = require('fs');
const prettify = require('html-prettify');
function readSourceToTargetConversion(filename){
    let source = fs.readFileSync('./tests/fixtures/'+filename+'.source.html',{encoding:'utf-8'});
    let css = fs.readFileSync('./tests/fixtures/'+filename+'.source.css',{encoding:'utf-8'});
    let target = fs.readFileSync('./tests/fixtures/'+filename+'.target.html',{encoding:'utf-8'});
    return {source,css,target}

}

test('test colors are ported over.',()=>{
    let {source,css,target} = readSourceToTargetConversion('colors')
    let result = tailwindify(source,css);
    result = prettify(result);
    target = prettify(target);
    expect(result).toBe(target);
})

test('Height widths are ported over.',()=>{
    let {source,css,target} = readSourceToTargetConversion('sizing')
    let result = tailwindify(source,css);
    result = prettify(result);
    target = prettify(target);
    expect(result).toBe(target);
})

test('test typography is ported over.',()=>{
    let {source,css,target} = readSourceToTargetConversion('typography')
    let result = tailwindify(source,css);
    result = prettify(result);
    target = prettify(target);
    expect(result).toBe(target);
})

test('test margins paddings are ported over.',()=>{
    let {source,css,target} = readSourceToTargetConversion('margin-paddings')
    let result = tailwindify(source,css);
    result = prettify(result);
    target = prettify(target);
    expect(result).toBe(target);
})

test('test flex and grid layouts.',()=>{
    let {source,css,target} = readSourceToTargetConversion('flex-grid')
    let result = tailwindify(source,css);
    result = prettify(result);
    target = prettify(target);
    expect(result).toBe(target);
})

test('test classes should have correct prefixes according to media query.',()=>{
    let {source,css,target} = readSourceToTargetConversion('media-queries')
    let result = tailwindify(source,css);
    result = prettify(result);
    target = prettify(target);
    expect(result).toBe(target);
})

test('simple html files',()=>{
    let {source,css,target} = readSourceToTargetConversion('inline-html')
    let result = tailwindify(source,css);
    result = prettify(result);
    target = prettify(target);
    expect(result).toBe(target);
})

test('if a no DOM node is found matching the selector, style node should be discarded from cssom',()=>{
    let {source,css,target} = readSourceToTargetConversion('inline-html')
    let result = tailwindify(source,css);
    result = prettify(result);
    target = prettify(target);
    expect(result).toBe(target);
})

