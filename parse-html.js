const htmlparser2 = require("htmlparser2");
const domUtils = require("domutils");
const postcss = require("postcss");
const render = require("dom-serializer").default;
const convert = require('./src/get-tailwind-classes-for-rule')

// Your HTML string
const html = `
    <html>
        
        <body>
            <h1>Title</h1>
            <div class="hide">
                <p>Hello, world!</p>
            </div>
        </body>
    </html>
`;

const css = `
  .hide {
    display:none;
  }
`;

let cssom = postcss.parse(css);
let sourceCssom = {};
for (let node of cssom.nodes) {
    // dont do anything if this is not css rule node
    if (node.type !== 'rule') {
        continue;
    }
    let rule = node;
    if (!rule.selector.startsWith('.')) {
        continue;
    }
    let props = {};
    for (let decl of rule.nodes) {
        //handles comment nodes between css declarations
        if (decl.type !== 'decl') continue;

        props[decl.prop] = decl.value;
    }
    sourceCssom[node.selector] = props;

}

// Parse HTML to DOM structure
const dom = htmlparser2.parseDocument(html);

// Function to recursively print the text inside each element
function processNode(element) {

    // we only want to process tags with classes
    if (element.type === "tag" || element.type === 'root') {
        if(element.name === 'div'){
           let oldClass =  element.attribs.class;
           let oldProps = sourceCssom['.'+oldClass];
           let classList = convert(oldProps);
           element.attribs.class = classList.join(' ');
           console.log(element.attribs);
        }
        domUtils.getChildren(element).forEach(child => {
            processNode(child);
        });
    }
}

// Start the recursive function at the root of the DOM
processNode(dom);

console.log(render(dom));
