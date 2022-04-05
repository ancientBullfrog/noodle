const _ = require('../index');
const assert = require('assert');

let numbers;
beforeEach(() => {
	numbers = [
		1,
		2,
		3
	];
});

it('resets [numbers].length to 3', () => {
	assert.strictEqual(numbers.length, 3);
});

it('should increase [numbers].length to 7', () => {
	let total = 0;
	_.forEach(numbers, value => {
		total += value;
	});
	assert.strictEqual(total, 6);
});

it('beforeEach is ran each time, [numbers].length reset to 3', () => {
	assert.strictEqual(numbers.length, 3);
});
