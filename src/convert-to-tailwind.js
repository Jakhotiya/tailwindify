const tailwinddb = require('../data/tailwind.json');
const generateHash = require('./generate-properties-hash');

/**
 * This function converts given css rules and returns tailwind classes that should be applied
 * @param cssRules
 * @returns {*[]}
 */
function convert(cssRules){
    let hash = generateHash(cssRules);
    if(tailwinddb.hasOwnProperty(hash))
        return [tailwinddb[hash]];

    //This single rule was not found in tailwinddb hence we should return empty from here
    if(Object.keys(cssRules).length===1){
        return [];
    }

    let list = []
    for(let key in cssRules){
        let rule = {[key]:cssRules[key]};

        let names = convert({[key]:cssRules[key]});
        list = [...list,...names]
    }
    return list;
}



module.exports = convert;