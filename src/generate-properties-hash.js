/**
 * Given css properties, generate a hash. Property order should not matter
 *  { display:block, color:black } should produce same hash as
 *  { color:black, display:block  }
 */

function generateHash(cssRules={}){
    let hash = ''
    let props = Object.keys(cssRules);
    props = props.sort();
    for(let prop of props){
        hash+= prop+':'+cssRules[prop];
    }
    return hash;
}

module.exports = generateHash;