const chalk = require('chalk');
/**
 * disables console functions ungracefully
 * creates seperate console method
 * would prefer to make moomin a global function but it doesnt really matter and is more appropriate no to since its a dev tool
 * ideally move console cursor movement here, oddly that caused problems and I want ot play GTA.
 */

const oldLog = console.log;
function moomin(...args) {
	oldLog.apply(console, args);
}

moomin.info = (...args) => {
	for (let [
		key,
		value
	] of args.entries()) {
		if (typeof value === 'string') args[key] = chalk.yellow(value);
	}
	oldLog.apply(console, args);
};

moomin.error = (...args) => {
	args.unshift('\u26cc\t');
	for (let [
		key,
		value
	] of args.entries()) {
		if (typeof value === 'string') args[key] = chalk.red(value.replace(/\n/g, '\n\t\t'));
	}
	oldLog.apply(console, args);
};

moomin.success = (...args) => {
	args.unshift('\u2713\t');
	for (let [
		key,
		value
	] of args.entries()) {
		if (typeof value === 'string') args[key] = chalk.green(value.replace(/\n/g, '\n\t\t'));
	}
	oldLog.apply(console, args);
};

console = {};
console.log = function(...args) {
	// DISABLED;
	// moomin(...args);
};

global.moomin = moomin;
module.exports = moomin;
