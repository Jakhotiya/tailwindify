const postcss = require('postcss');


function generateMap(css) {
    let cssom = postcss.parse(css);
    let result = {};
    for (let node of cssom.nodes) {
        // dont do anything if this is not css rule node
        if (node.type !== 'rule') {
            continue;
        }
        let rule = node;
        if (!rule.selector.startsWith('.')) {
            continue;
        }
        let key = '', value = node.selector
        for (let decl of rule.nodes) {
            //handles comment nodes between css declarations
            if (decl.type !== 'decl') continue;

            key += decl.prop + ':' + decl.value + ' ';
        }
        result[key.trim()] = value;

    }
    return result;
}

module.exports = generateMap;