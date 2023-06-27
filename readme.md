# Tailwindify

Library converts HTML CSS into tailwind based UI

## How to set this up ?
```bash
git@github.com:Jakhotiya/tailwindify.git
cd tailwindify;
npm install;
```

Once the codebase is ready, we need to generate a master tailwind css file.
This tailwind output css file is unpurged version.
tailwind.config.js in this repository shows how to avoid purging anything by using safelist.
This file is used to lookup utility class for a given css rule

create two files named input.css and output.css in project root

Roughly your input.css will have following contents
```css
@tailwind base;
@tailwind components;
@tailwind utilities
```
when you run following command output.css should be generated.
```bash
npx tailwindcss -i ./src/input.css -o ./dist/output.css
```
Once you have a tailwind file ready with filename `output.css`
run following to generate one time tailwinddb using following command

```bash
node generate-reverse-class-index.js
```

A big json file should be generated in data directory.

Once this is done. Go ahead and run tests

## How does this work?

1. Download HTML and CSS that you want to tailwindify.
2. Pass html to htmlparser and generate DOM
3. We need to build a complete CSS from all the styles. That includes:
   * HTML can contain links to css files. They need to be downloaded and merged in order.
   * CSS that is defined in the style tag of the document needs to be added further to the end
4. Pass the full css string to css parser. We are using PostCss here
5. Traverse CSSOM generated from source css. Iterate over each rule.
6. Each rule contains selectors and declarations. Find nodes given by selectors
7. Find the tailwind classes that would replace the declarations for the selector from previous step.
8. Add these tailwind classes to the html node
9. We keep the existing classes intact in this first phase. We will later on pass this output to purging program where DOM will be optimized.
10. CSSOM is a tree. When we process a declaration, we mark it for removal from the tree. At the end we remove all nodes that are marked for removal
11. We Render CSSOM back to style rules and append these styles in the html head. This way page does not break. Our goal is to reduce such styles

## When will be manual configuration needed?
If your source css contains property values that are non-standard from tailwind perspective, we will need to 
tell our program how to handle this situation. Consider following source css

```css
/** The whole css block is known as Rule
*  Every property specification inside { } block is known as declaration.  
*/
.foo {
   margin:13px;
   color:red;
   font-size:17px;
   border : solid 1px green
}
```

Now if red and green colors are not mentioned in your tailwind config, we will have to provide a map/function
for tailwindify to be able to migrate such rules.

## Components in this codebase


#### 1. tailwindify.js

This is the file where the logic kicks in. This file takes html and css as input.
It returns the target html. 

#### 2. get-tailwind-classes-for-rule.js
This file's only responsibility is to process css rule given. It returns tailwind classes
for declarations it could process. it also returns declarations it could not process. 


## Removing old classes
What if old class from old framework matches a tailwind class. This would introduce a bug
hence removing old classes is important.