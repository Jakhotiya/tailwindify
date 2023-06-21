const htmlparser2 = require("htmlparser2");
const domUtils = require("domutils");
const postcss = require("postcss");
const render = require("dom-serializer").default;
const convert = require('./src/convert-to-tailwind')
const CSSselect = require("css-select");
const tailwind = require('tailwindcss');

function tailwindify(html,css){
    const dom = htmlparser2.parseDocument(html);
    let cssom = postcss.parse(css);
    let sourceCssom = {};
    for (let node of cssom.nodes) {
        // dont do anything if this is not css rule node
        if (node.type !== 'rule') {
            continue;
        }
        let rule = node;

        let props = {};
        for (let decl of rule.nodes) {
            //handles comment nodes between css declarations
            if (decl.type !== 'decl') continue;

            props[decl.prop] = decl.value;
        }
        sourceCssom[node.selector] = props;
        let elems = CSSselect.selectAll(node.selector, dom, {});
        for(let el of elems){
            let classList = convert(props);
            if(classList.length===0){
                //@TODO when no tailwind classes are returned for this set of rules
                //Log this as an error that needs to be manually handled.
                break;
            }
            //We dont want to remove old classes

            classList = classList.map((cl)=>cl.slice(1));
            let oldClasses = el.attribs.class ? el.attribs.class+' ' : '';
            el.attribs.class = oldClasses + classList.join(' ');
        }
    }





    // function processNode(element) {
    //
    //     // we only want to process tags with classes
    //     if (element.type === "tag" || element.type === 'root') {
    //         if(element.name === 'div'){
    //             let oldClass =  element.attribs.class;
    //             let oldProps = sourceCssom['.'+oldClass];
    //             let classList = convert(oldProps);
    //             classList = classList.map((cl)=>cl.slice(1))
    //             element.attribs.class = classList.join(' ');
    //
    //         }
    //         domUtils.getChildren(element).forEach(child => {
    //             processNode(child);
    //         });
    //     }
    // }
    //
    // processNode(dom);

    return render(dom);
}

module.exports = tailwindify
