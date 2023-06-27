const getTailwindClassesForRule = require('../src/get-tailwind-classes-for-rule')

test('display none style property should return .hidden class',()=>{
    let input = {
        display:"none"
    }
    let actual = getTailwindClassesForRule(input);
    expect(actual.classList).toEqual(['.hidden']);
})

test('if empty css object is provided empty class list should be returned',()=>{

    let actual = getTailwindClassesForRule();
    expect(actual.classList.length).toEqual(0);
    expect(actual.classList).toEqual([]);
})

test('multiple classes should be returned if css rules contains a lot of properties',()=>{
    let input = {
        "display":"flex",
        "flex-shrink": 0,
        "width": "100%"
    }
    let actual = getTailwindClassesForRule(input);
    expect(actual.classList).toEqual(['.flex','.shrink-0','.w-full']);
})

test('if a css property value does not exist in tailwinddb, convert should return list of classes that exist and also declarations that it could not process',()=>{
    let input = {
        "display":"flex",
        "flex-shrink": 0,
        "width": "100%",
        "color":"red"
    }
    let actual = getTailwindClassesForRule(input);
    expect(actual.classList).toEqual(['.flex','.shrink-0','.w-full']);
    expect(actual.skipped).toEqual({"color":"red"});
})

test('get classes for font-sizes',()=>{
    let style = {
        "font-size":"1rem",
        "line-height": "1.5rem"
    }
    let actual = getTailwindClassesForRule(style);
    expect(actual.skipped).toEqual({});
    expect(actual.classList).toEqual(['.text-base']);

})