/**
 * records passed/failed tests
 * improvements could be to record more data for a final  : this passed, this didnt display ...or just scroll through console??
 * provides timing functions
 */

const timers = [];

stats = {
	testFiles : {},
	tests     : {
		total : 0,
		pass  : 0,
		fail  : 0
	},
	failed({ fileName, description }) {
		this.testFiles[fileName].testsFailed.push(description);
	},
	passed({ fileName }) {
		// this.tests.pass += num;
		++this.testFiles[fileName].testsPassed;
	},
	get() {
		const stats = {};
		for (let [
			key,
			value
		] of Object.entries(this.testFiles)) {
			stats[key] = {
				elapsedTime : value.elapsedTime,
				totalTests  : value.totalTests,
				testsPassed : value.testsPassed,
				testsFailed : 0
			};
			if (value.testsFailed.length) {
				const failedTests = {};
				for (let test of value.testsFailed) {
					failedTests[test] = false;
				}
				stats[key].testsFailed = failedTests;
			}
		}

		return stats;
	},

	timeStart(label) {
		timers.push({ label, startTime: Date.now() });
	},
	timeEnd(label) {
		const timer = timers.find(el => el.label === label);
		const timeNow = Date.now();
		const elapsed = timeNow - timer.startTime;
		timers.splice(timers.indexOf(timer), 1);
		return elapsed;
	},
	add(fileName) {
		if (!this.testFiles[fileName]) {
			this.testFiles[fileName] = {
				elapsedTime : 0,
				totalTests  : 0,
				testsPassed : 0,
				testsFailed : []
			};
		}
	}
};

module.exports = stats;
