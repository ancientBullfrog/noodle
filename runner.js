require('./modules/expect');
require('./modules/moomin');

const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

const render = require('./render');
const stats = require('./modules/statsReporter');

const { promiseWhen } = require('./utils/promise');

/**
 * @property {array} testFiles : collection of test files to load
 * @property {array} ignore : collection of directories to skip checking for test files
 */
class Runner {
	constructor({ ignore = [], allowedFileTypes = [] }) {
		// allows test files to load HTML
		global.render = render;

		// store current executing file beforeEach
		global.beforeEach = fn => (this.beforeEachTemp = fn);

		// create test object for later callback
		global.it = (description, fn) => {
			const unitTest = { description, fn };

			/**
			 * find testFileObject for currently executing .test.js file 
			 * Add unit-test functions to unitTests collection on file object
			 */
			const file = this.testFileObjects.find(testFile => testFile.file.fileName === this.currentlyParsingFile);
			file.beforeEach = this.beforeEachTemp;
			file.unitTests.push(unitTest);
			++stats.tests.total;
		};

		// collection of .test.js file names and paths
		this.testFiles = [];
		// collection of Object representations of .test.js files
		this.testFileObjects = [];
		// reference to file being parsed by require
		this.currentlyParsingFile = null;
		// temp storage for currentlyParsingFile beforeEach fn
		this.beforeEachTemp = null;

		/**
		 * ignore these directories when collecting files
		 */
		this.ignore = [
			'node_modules',
			...ignore
		];
	}

	/**
	 * Looks through directory tree to find .test.js files. Ignores specified directories
	 * @param {string} targetPath CWD path 
	 */
	async collectFiles(targetPath, targetFiles = []) {
		// open current working directory and get files
		const files = await fs.promises.readdir(targetPath);
		for (let file of files) {
			// create absolute file path - @targetPath is cwd
			const filePath = path.join(targetPath, file);

			// get file stats - isFile || isDirectory
			const lstat = await fs.promises.lstat(filePath);
			// add .test.js files
			// ** this is different to a normal bredth first approach because it only adds filtered files vs ANY file
			if (lstat.isFile() && file.includes('.test.js')) {
				const fileName = file.slice(file.lastIndexOf('/') + 1);

				if (targetFiles.length && !targetFiles.includes(fileName)) continue;
				this.testFiles.push({ path: filePath, fileName: file });
			}
			else if (lstat.isDirectory() && !this.ignore.includes(file)) {
				// read child directory contents
				const childFiles = await fs.promises.readdir(filePath);
				// adds current path <file> to child path <f> adds to [files]
				// when loop gets to this entry it checks if its a file to add or directory to look in
				files.push(...childFiles.map(f => path.join(file, f)));
			}
		}
	}

	createTestFileObject() {
		/**
		 * Creates this.testFileObjects representing files in testFiles collection
		 * @param {[promise]} : collection of promises containing unit-tests. Used when parallel test execution is applied
		 * @param {Object} file : path and fileName data
		 * @param {[function]} tests : collection of callback functions containing unit-test code
		 */
		for (let file of this.testFiles) {
			try {
				//use messager here to update command line
				moomin.info('PARSING', file.fileName);
				this.currentlyParsingFile = file.fileName;
				this.testFileObjects.push({
					file,
					unitTests    : [],
					promises     : [],

					async runUnitTests() {
						for (let test of this.unitTests) {
							const testId = this.unitTests.indexOf(test);

							try {
								const { fn, description } = test;
								// moomin(`\tIt ${description}`);

								/**
								 * run tests in parallel if env setup not present
								 */
								if (!this.beforeEach) {
									this.promises.push(
										new Promise((resolve, reject) => {
											/** 
										 * returns a promise resolved with the value of fn() : asyncFn, return value, or null
										 * required for .then() to work on syncronous functions
										 * Try...catch works for syncronous functions which throw errors
										 * async/Promise caught in .then
										 */
											try {
												Promise.resolve(fn())
													.then(data => resolve({ description }))
													.catch(data => reject({ description, data }));
											} catch (data) {
												// used when fn is not async and throws
												reject({ description, data });
											}
										})
									);
								}
								else {
									stats.timeStart(testId);
									// call unit-test environment setup
									this.beforeEach();
									// catch Promise if a sync test returns one
									const func = fn();
									// catch resolved/return value
									const returnedData = await func;
									// move console cursor up one line and clear all text below
									// process.stdout.moveCursor(0, -1);
									// process.stdout.clearScreenDown();
									// re-print test id in green
									moomin.success(`It ${description} - ${chalk.yellow(stats.timeEnd(testId) / 1000)}`);
									stats.passed();
								}
							} catch (error) {
								/**
							    * if a test fails show in red
							    */

								const { description } = test;
								// go back to description line and clear
								process.stdout.moveCursor(0, -1);
								process.stdout.clearLine(0);
								moomin.error(
									`It ${description} - ${chalk.yellow(stats.timeEnd(testId) / 1000)}`,
									`\n${error.message}\n`
								);
								stats.failed();
							}
						}

						// return if sequential testing
						if (!this.promises.length) return;

						// update console reporting for parallel unit-test execution
						try {
							stats.timeStart('promises');
							const promiseResults = await promiseWhen(this.promises);
							/**
							 * Removed console manipulation as cannot control extra lines due to wrapping
							 */
							// move cursor up to overwrite original unit-test info logs
							// process.stdout.moveCursor(0, -promiseResults.length);
							// process.stdout.clearScreenDown();

							// print result based on success value
							for (let result of promiseResults) {
								const testId = promiseResults.indexOf(result);
								const { success, description, data } = result;

								if (success) {
									moomin.success(`It ${description}`);
									stats.passed();
									continue;
								}
								moomin.error(` It ${description}`, `\n${data ? data.message : ''}\n`);
								stats.failed();
							}
							moomin(chalk.yellow(`Elapsed Time ${stats.timeEnd('promises') / 1000}s`));
						} catch (error) {
							moomin('ERROR FROM PROMISES???', error.message);
						}
					}
				});

				// require will load and pass and execute .test.js file
				require(file.path);
				// clear beforeEach if next file does not have one
				this.beforeEachTemp = null;
			} catch (error) {
				moomin(chalk.blue(error.message, `\n`));
			}
		}
	}

	/**
	 * loops through testFileObject array to execute unit-tests per file/object
	 */
	async runTests() {
		for (let file of this.testFileObjects) {
			const fileObjectId = this.testFileObjects.indexOf(file);

			moomin.info('\nRunning Tests In', file.file.fileName, '\n');
			stats.timeStart(file.file.fileName);
			await file.runUnitTests();
			//tests complete?
			moomin.info(`\nTesting Completed  in : ${stats.timeEnd(file.file.fileName) / 1000}\n`);
			// end if no more files to test
			if (fileObjectId + 1 >= this.testFileObjects.length) {
				moomin.info('\nThere are no More Files to Test!');
				moomin(stats.get(), '\n');
			}
		}
	}
	// move process args to index.js for use with flags
	run = async () => {
		const [
			argv0,
			argv1,
			...files
		] = process.argv;
		await this.collectFiles(process.cwd(), files);
		this.createTestFileObject();
		await this.runTests();
	};
}

module.exports = Runner;
