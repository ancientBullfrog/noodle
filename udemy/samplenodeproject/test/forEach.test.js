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

it('FILE 1 - should sum an array then increase length to 7', () => {
	let total = 0;
	_.forEach(numbers, value => {
		total += value;
	});
	assert.strictEqual(total, 6);
});

it('FILE 1 - beforeEach is ran each time, numbers.length reset to 3', () => {
	assert.strictEqual(numbers.length, 3);
});

it('FILE 1 << shows time sensitive tests in multiple test files become out of sync with their associated test file', () => {
	return new Promise(resolve => {
		setTimeout(() => {
			resolve();
		}, 3000);
	});
});
