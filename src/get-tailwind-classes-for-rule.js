const tailwinddb = require('../data/tailwind.json');
const generateHash = require('./generate-properties-hash');

/**
 * This function converts given css rules and returns tailwind classes that should be applied
 * @param cssRules
 * @returns {classList:[],skipped:{*}}
 */
function getTailwindClassesForRule(cssRules={}){

    if(Object.keys(cssRules).length===0){
        return { classList: [], skipped:{} };
    }

    let hash = generateHash(cssRules);
    if(tailwinddb.hasOwnProperty(hash)){
        return {
            classList: [tailwinddb[hash]],
            skipped:{}
        };
    }

    //This single rule was not found in tailwinddb hence we should return empty from here
    if(Object.keys(cssRules).length===1){
        return {classList: [],skipped: cssRules};
    }

    let finalResult = {classList:[],skipped:{}}
    for(let key in cssRules){
        let result = getTailwindClassesForRule({[key]:cssRules[key]});
        finalResult = {
            classList: [...finalResult.classList,...result.classList],
            skipped: {...finalResult.skipped,...result.skipped}
        }
    }
    return finalResult;
}



module.exports = getTailwindClassesForRule;