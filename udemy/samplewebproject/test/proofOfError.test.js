const assert = require('assert');

it(' FILE 2 - tests from file 1 complete after file 2', () => {
	return new Promise((resolve, reject) =>
		setTimeout(() => {
			resolve('This Promise resolved!');
		}, 1000)
	);
});
