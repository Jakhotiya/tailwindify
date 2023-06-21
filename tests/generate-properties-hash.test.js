const generateHash = require('../src/generate-properties-hash');

test('same hash is generated irrespective of order of css declarations',()=>{
  let css1 = {
      "display":"block",
      "color":"red"
    }

    let css2 = {
        "color":"red",
        "display":"block"
    }

    expect(generateHash(css1)).toEqual(generateHash(css2))

})