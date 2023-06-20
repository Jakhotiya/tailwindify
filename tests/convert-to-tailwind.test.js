const convert = require('../src/convert-to-tailwind')

test('display none style property should return .hidden class',()=>{
    let input = {
        display:"none"
    }
    let actual = convert(input);
    expect(actual).toEqual(['.hidden']);
})