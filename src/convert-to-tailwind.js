const tailwinddb = require('../data/tailwind.json');

/**
 * This function converts given css rules
 * @param cssRules
 * @returns {*[]}
 */
function convert(cssRules){
    let hash = generateHash(cssRules);
    return [tailwinddb[hash]];
}

function generateHash(cssRules){
    let hash = ''
    for(let prop in cssRules){
        hash+= prop+':'+cssRules[prop];
    }
    return hash;
}

module.exports = convert;