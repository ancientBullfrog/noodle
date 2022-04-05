const chalk = require('chalk');
const stats = require('../modules/statsReporter');
/**
		 * Waits for all promises to finish and returns results in an array. Similar to Promise.all except rejected promises do not cause all promises to fail but are instead returned as a failed object
		 * @param {array} promises array of promises 
		 * @returns array of promise results
		 */
function promiseWhen(promises) {
	// collection of resolved promises in the same order they were received
	const results = [];

	return new Promise(resolve => {
		for (let promise of promises) {
			const promiseIndex = promises.indexOf(promise);
			stats.timeStart(promiseIndex);
			promise
				.then(response => {
					const { description, data } = response;
					const time = chalk.yellow(`${stats.timeEnd(promiseIndex) / 1000}s`);
					results[promiseIndex] = { success: true, description, data, time };
					promises.pop();
				})
				.catch(error => {
					const { description, data } = error;
					results[promiseIndex] = { success: false, description, data };
					promises.pop();
				})
				.finally(() => {
					promises.length === 0 && resolve(results);
				});
		}
	});
}

module.exports.promiseWhen = promiseWhen;
