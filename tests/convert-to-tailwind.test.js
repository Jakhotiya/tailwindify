const convert = require('../src/convert-to-tailwind')

test('display none style property should return .hidden class',()=>{
    let input = {
        display:"none"
    }
    let actual = convert(input);
    expect(actual).toEqual(['.hidden']);
})

test('if empty css object is provided empty class list should be returned',()=>{

    let actual = convert();
    expect(actual.length).toEqual(0);
    expect(actual).toEqual([]);
})

test('multiple classes should be returned if css rules contains a lot of properties',()=>{
    let input = {
        "display":"flex",
        "flex-shrink": 0,
        "width": "100%"
    }
    let actual = convert(input);
    expect(actual).toEqual(['.flex','.shrink-0','.w-full']);
})

test('if a css property value does not exist in tailwinddb, convert should return list of classes that exists',()=>{
    let input = {
        "display":"flex",
        "flex-shrink": 0,
        "width": "100%",
        "color":"red"
    }
    let actual = convert(input);
    expect(actual).toEqual(['.flex','.shrink-0','.w-full']);
})