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

Once you have a tailwind file ready with filename `output.css`
run following to generate one time tailwinddb using following command

```bash
node generate-reverse-class-index.js
```

A big json file should be generated in data directory.

Once this is done. Go ahead and run tests

## How does this work?

1. Download HTML and CSS
2. Pass html to htmlparser
3. pass the default css parser
   a. CSS that is in files needs to downloaded and added to cssom object
   b. CSS that is defined in the style tag of the document needs to be added further to the end
4. Traverse DOM and read classes from each node
5. For each class found lookup css rules defined in CSSOM that we built
6. For each rule lookup tailwinddb that we have built and generate list of classlist that we need

## Tests cover as follow

1. simple
2. multiline
3. sibling
4. child-level1
5. child-level2
6. child-level3 // contains multiline + sibling selector
