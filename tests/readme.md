# Tests and how to write more

tailwindify.tests.js is the end to end test of the complete program.
It uses fixtures created in tests/fixtures directory. Following naming convention is followed
and the naming convention is used while reading files.
To test color related properties we create
* colors.source.html
* colors.source.css
* colors.target.html

Source html and css that will be fed to tailwindify algorithm will be contained 
in *.source files.
*.target files contain the expected output, which is final html that has tailwind classes applied.

Following code found in tailwindify.test.js uses this convention
```js
function readSourceToTargetConversion(filename){
    let source = fs.readFileSync('./tests/fixtures/'+filename+'.source.html',{encoding:'utf-8'});
    let css = fs.readFileSync('./tests/fixtures/'+filename+'.source.css',{encoding:'utf-8'});
    let target = fs.readFileSync('./tests/fixtures/'+filename+'.target.html',{encoding:'utf-8'});
    return {source,css,target}

}
// following snippet can then be used to read fixtures related to colors
let {source,css,target} = readSourceToTargetConversion('colors');
```

