const generateMap = require('../src/properties-to-class-map');

test('genrate hash for simple css',()=>{
    let css = `
    .max-w-fit {
  max-width: -moz-fit-content;
  max-width: fit-content;
}
    `

    let result = generateMap(css);
    let expected = {
        "max-width:-moz-fit-content max-width:fit-content":".max-w-fit"
    }
    expect(result).toEqual(expected);

})

test('do not generate map for sudo selectors',()=>{
    let css = `
    *,
::before,
::after {
  box-sizing: border-box;
  /* 1 */
  border-width: 0;
  /* 2 */
  border-style: solid;
  /* 2 */
  border-color: #e5e7eb;
  /* 2 */
}
.invisible {
  visibility: hidden;
}
    `

    let result = generateMap(css);
    let expected = {
        "visibility:hidden":".invisible"
    }
    expect(result).toEqual(expected);

})

