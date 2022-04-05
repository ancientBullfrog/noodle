const assert = require('assert');

let numbers = [];
beforeEach(() => {
	numbers = [
		1,
		2,
		3
	];
});

it('FILE 2 - sets numbers.length to 6 after 1 seconds', () => {
	return new Promise(resolve => {
		setTimeout(() => {
			numbers.push(4);
			numbers.push(5);
			numbers.push(6);
			resolve();
		}, 1000);
	});
});

it('FILE 2 - proves the beforeEach is unaffected by other time sensitive tests.', () => {
	const numbersBE = Array.from(numbers);
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			numbers.length === 3 && resolve();
			numbers.length !== 3 &&
				reject(
					new Error(
						`\nnumbers after this test beforeEach reset = [${numbersBE}]\nnumbers after last test completes = [${numbers}]\n\nExpected numbers.length to be 3 but found ${numbers.length}\n\n\tHOUSTON WE HAVE A PROBLEM!\n\nWhen a test takes time to complete and updates the beforeEach-environment;\nA second test can unexpectedly fail due to:\n\t- its beforeEach performing the reset BEFORE the previous test completed.\n`
					)
				);
		}, 1500);
	});
});
