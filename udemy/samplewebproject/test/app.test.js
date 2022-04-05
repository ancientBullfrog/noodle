const assert = require('assert');

it(' FILE 1 - has a text input', async () => {
	const dom = await render('index.html');

	const input = dom.window.document.querySelector('input');

	assert(input);
});

it(' FILE 1 - shows a success message with a valid email', async () => {
	const dom = await render('index.html');

	const input = dom.window.document.querySelector('input');
	input.value = 'alskdjf@aslkdjf.com';
	dom.window.document.querySelector('form').dispatchEvent(new dom.window.Event('submit'));

	const h1 = dom.window.document.querySelector('h1');

	assert.equal(h1.innerHTML, 'Looks good!');
});

it(' FILE 1 - shows a fail message with a invalid email', async () => {
	const dom = await render('index.html');

	const input = dom.window.document.querySelector('input');
	input.value = 'alskdjfaslkdjf.com';
	dom.window.document.querySelector('form').dispatchEvent(new dom.window.Event('submit'));

	const h1 = dom.window.document.querySelector('h1');

	assert.equal(h1.innerHTML, 'Invalid email');
});

it(' FILE 1 - Has a text input', async () => {
	const dom = await render('index.html');
	const input = dom.window.document.querySelector('input');
	assert(!input);
});

it(' FILE 1 - should wait for 1.5 seconds before resolving', () => {
	return new Promise((resolve, reject) =>
		setTimeout(() => {
			resolve('This Promise resolved!');
		}, 1500)
	);
});

it('Has a problem!'.toUpperCase(), () => {
	const message = `
   Reporting becomes confusing when multiple test files are used. 
   Time dependent tests, as used for JSDom testing, cause results to get mixed up.
   When there are lots of results it could become difficult to find the test with the errors.
   `;
	throw new Error(message);
});
