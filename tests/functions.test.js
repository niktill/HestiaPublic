const functions = require('./functions');

// sample test success
test('Add 1 + 1 to equal 2', () => {
    expect(functions.add(1, 1)).toBe(2);
});

// sample test fail
// test('Add 1 + 1 to equal 3', () => {
//     expect(functions.add(1, 1)).toBe(3);
// });