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

function getModifierFromMediaQuery(mediaRule){
    if(mediaRule.params.includes('min-width') && mediaRule.params.includes('480px')){
        return 'xs';
    }
    if(mediaRule.params.includes('min-width') && mediaRule.params.includes('640px')){
        return 'sm';
    }
    if(mediaRule.params.includes('min-width') && mediaRule.params.includes('768px')){
        return 'md';
    }
    if(mediaRule.params.includes('min-width') && mediaRule.params.includes('1024px')){
        return 'lg';
    }
    if(mediaRule.params.includes('min-width') && mediaRule.params.includes('1536px')){
        return '2xl';
    }
}

/**
 * Modifies DOM and returns rules that could not be processed.
 * Function mutates both DOM and rule
 * @param dom
 * @param rule
 * @param mediaPrefix
 */
function processRuleForDOM(dom, rule,mediaPrefix) {

    /**
     * Here we ignore all @ rules which are not media queries
     * Other atrules like @page @key-frames are documented at
     * https://developer.mozilla.org/en-US/docs/Web/CSS/At-rule
     */
    if(rule.type === 'atrule' && rule.name !== 'media'){
        return;
    }

    if(rule.type === 'atrule'){
        for(let innerRule of rule.nodes){
            let prefix = getModifierFromMediaQuery(rule);
            processRuleForDOM(dom,innerRule,prefix)
        }
        return;
    }

    /**
     * Since CssSelector lib can not process pseudo selectors we will skip
     * them and add to the style tag in the body
     */
    let selector = rule.selector;
    if(!rule.selector){
        return;
    }
    if (selector.includes(':')) {
        return
    }

    let elems = [];
    try{
        elems = CSSselect.selectAll(selector, dom, {});
    }catch (e){
        console.error('Error occured while processing rule:',rule.selector);
        return;
    }

    if (elems.length === 0) {
        rule.markRemoval = true;
        return
    }

    let props = {};

    for (let decl of rule.nodes) {
        //handles comment nodes between css declarations
        if (decl.type !== 'decl') continue;

        props[decl.prop] = decl.value;
    }


    let {classList, skipped} = getTailwindClassesForRule(props);

    for(let decl of rule.nodes) {

        //handles comment nodes between css declarations
        if (decl.type !== 'decl') continue;

        if(!skipped.hasOwnProperty(decl.prop)){
            decl.markRemoval = true;
        }
    }

    if (classList.length === 0) {
        return
    }
    // Remove . charecter from class
    classList = classList.map((cl) => {
        cl = cl.slice(1);
        return mediaPrefix ? mediaPrefix+':'+cl : cl;
    });

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

function removeNodesMarkedForRemoval(node){
        if(node.hasOwnProperty('nodes')){
            node.nodes.forEach(removeNodesMarkedForRemoval)
            let toRemove = node.nodes.filter(n=>{
                if(n.type === 'rule' || n.type ==='atrule'){
                    return typeof n.nodes === 'undefined' || n.nodes.length === 0 || n.markRemoval;
                }
                return n.markRemoval;
            });
            toRemove.forEach(n=>n.remove());
        }
}

function tailwindify(html,css){
    const dom = htmlparser2.parseDocument(html);
    removeStyleLinks(dom);
    const stylesFromPage =  removeAllStyleTags(dom);

    let cssom = postcss.parse(css+stylesFromPage);


    for (let node of cssom.nodes) {
        // dont do anything if this is not css rule node
        if (node.type !== 'rule' && node.type!=='atrule') {
            continue;
        }

        /**
         * This method mutates both DOM and CSSOM. It will add classes to DOM
         * and will remove processed declarations from css rule
         */
        processRuleForDOM(dom,node,'')

    }



    let elems = CSSselect.selectAll('head', dom, {});
    removeNodesMarkedForRemoval(cssom);
    let leftOverCss  = '';
        postcss.stringify(cssom,i=>{
            leftOverCss += i;
        });
    let StyleTag = `    <style>
    ${leftOverCss}
    </style>
`
    if(leftOverCss){
        domUtils.appendChild(elems[0],htmlparser2.parseDocument(StyleTag))
    }
    return render(dom);
}

module.exports = tailwindify
