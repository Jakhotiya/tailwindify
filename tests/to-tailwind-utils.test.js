const {getNearestMatchingColor} = require("../src/to-tailwind-utils");

test('colors are convered to rgba format before looking up in database',()=>{

    let result = getNearestMatchingColor('#ef4444')
    expect(result).toBe('rgb(239 68 68 / 1)');
})