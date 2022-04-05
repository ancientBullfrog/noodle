const assert = require('assert');

class Expect {
	constructor(value) {
		this.value = value;
	}

	toBe(value) {
		if (this.value === value) return this;
		else assert.strictEqual(this.value, value);
	}

	isMoreThan(value) {
		if (this.value > value) return this;
		else throw new Error(`Expected ${this.value} to be more than ${value}\n\n! ${this.value} > ${value}`);
	}

	isLessThan(value) {
		if (this.value < value) return this;
		else throw new Error(`Expected ${this.value} to be less than ${value}\n\n! ${this.value} < ${value}`);
	}

	toInclude(value) {
		if (this.value.includes(value)) return this;
		else throw new Error(`Expected [${this.value}] to include ${value}\n\n![${this.value}] << ${value}`);
	}
	get isTypeofString() {
		if (typeof this.value === 'string') return this;
		else
			throw new Error(
				`Expected ${this.value} to be a String\n\ntypeof ${this.value} <${typeof this.value}> !== <String>`
			);
	}
}

global.expect = value => new Expect(value);
