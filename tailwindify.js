const htmlparser2 = require("htmlparser2");
const domUtils = require("domutils");
const postcss = require("postcss");
const render = require("dom-serializer").default;
const getTailwindClassesForRule = require('./src/get-tailwind-classes-for-rule')
const CSSselect = require("css-select");
const tailwind = require('tailwindcss');

function removeAllStyleTags(dom){
    let styleTags = CSSselect.selectAll('style', dom, {});
    return styleTags.reduce((acc,style)=>{

        let texts = style.children.map(node=>node.data)
        acc += texts.join(' ');
        domUtils.removeElement(style);
        return acc;
    },'')

}

/**
 * Modifies DOM and returns rules that could not be processed.
 * Function mutates both DOM and rule
 * @param dom
 * @param rule
 * @param media
 */
function processRuleForDOM(dom, rule, media) {

    /**
     * Since CssSelector lib can not process pseudo selectors we will skip
     * them and add to the style tag in the body
     */
    let selector = rule.selector;
    if (selector.includes(':')) {
        return
    }

    let elems = CSSselect.selectAll(selector, dom, {});
    if (elems.length === 0) {
        return
    }

    let props = {};

    for (let decl of rule.nodes) {
        //handles comment nodes between css declarations
        if (decl.type !== 'decl') continue;

        props[decl.prop] = decl.value;
    }


    let {classList, skipped} = getTailwindClassesForRule(props);

    for (let i=0;i<rule.nodes.length;i++) {
        let decl = rule.nodes[i]
        //handles comment nodes between css declarations
        if (decl.type !== 'decl') continue;

        if(!skipped.hasOwnProperty(decl.prop)){
            // rule.nodes.splice(i,1);
            decl.remove();
        }
    }

    if(rule.nodes.length===0){
        rule.remove();
    }

    if (classList.length === 0) {
        return
    }
    // Remove . charecter from class
    classList = classList.map((cl) => cl.slice(1));

    for (let el of elems) {
        //We dont want to remove old classes
        let oldClasses = el.attribs.class ? el.attribs.class + ' ' : '';
        el.attribs.class = oldClasses + classList.join(' ');
    }

}

function removeStyleLinks(dom){
    let styleLinks = CSSselect.selectAll('link[rel="stylesheet"]', dom, {});
    for(let link of styleLinks){
        domUtils.removeElement(link);
    }
}

function tailwindify(html,css){
    const dom = htmlparser2.parseDocument(html);
    removeStyleLinks(dom);
    const stylesFromPage =  removeAllStyleTags(dom);

    let cssom = postcss.parse(css+stylesFromPage);


    for (let node of cssom.nodes) {
        // dont do anything if this is not css rule node
        if (node.type !== 'rule') {
            continue;
        }

        /**
         * This method mutates both DOM and CSSOM. It will add classes to DOM
         * and will remove processed declarations from css rule
         */
        processRuleForDOM(dom,node,{})


    }
    let elems = CSSselect.selectAll('head', dom, {});

    let leftOverCss  = '';
        postcss.stringify(cssom,i=>{
            leftOverCss += i;
        });
    leftOverCss = `    <style>
    ${leftOverCss}
    </style>
`
    domUtils.appendChild(elems[0],htmlparser2.parseDocument(leftOverCss))
    return render(dom);
}

module.exports = tailwindify
