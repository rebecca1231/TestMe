const assert = require('assert');

const { forEach } = require('../index');

let numbers;
beforeEach(() => {
  numbers = [1,2,3]
});

it('should sum an array', () => {
    const numbers = [1,2,3];

    let total = 0;
    forEach(numbers, (value) => {
        total += value
    });
    assert.strictEqual(total, 6);
    numbers.push(4);
    numbers.push(5);
});

it('beforeEach is run each time', () => {
  assert.strictEqual(numbers.length, 4)
});

