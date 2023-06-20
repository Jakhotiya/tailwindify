const fs = require('fs');
const generateMap =  require('./src/properties-to-class-map');

let css = fs.readFileSync('./output.css',{encoding:'UTF-8'});

let result = generateMap(css);

fs.writeFileSync('./data/tailwind.json',JSON.stringify(result,null,2));