const tailwindify = require('../tailwindify');
const fs = require('fs');
function readSourceToTargetConversion(filename){
    let source = fs.readFileSync('./tests/fixtures/'+filename+'.source.html',{encoding:'utf-8'});
    let target = fs.readFileSync('./tests/fixtures/'+filename+'.target.html',{encoding:'utf-8'});
    return {source,target}

}
test('simple html files',()=>{
    const {source,target} = readSourceToTargetConversion('inline-html')
    let externalCss = `
    .hide {
       display:none;
    }
    `;
    expect(target).toBe(tailwindify(source,externalCss));
})