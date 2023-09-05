const sum = require('../sum.js')
test('add 2 number', () => {
    expect(sum(2,3)).toBe(5);
})