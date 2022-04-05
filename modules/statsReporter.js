/**
 * records passed/failed tests
 * improvements could be to record more data for a final  : this passed, this didnt display ...or just scroll through console??
 * provides timing functions
 */

const moomin = require('./moomin');

const timers = [];

stats = {
	tests     : {
		total : 0,
		pass  : 0,
		fail  : 0
	},
	failed(num = 1) {
		this.tests.fail += num;
	},
	passed(num = 1) {
		this.tests.pass += num;
	},
	get() {
		return { 'Total Tests': this.tests.total, 'Tests Passed': this.tests.pass, 'Tests Failed': this.tests.fail };
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
	}
};

module.exports = stats;
