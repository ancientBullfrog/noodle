/**
 * The render.js file is a wrapper for the fromFile() method; used to load html files into jsdom
 * A wrapper has been used so various JSDOM functions can be exposed on the global object for use by the test files. 
 */

const path = require('path');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;

/**
  * Takes a filename, creates full path, loads into jsdom object. Files must be htm or html
  * @param {string} fileName  name of html file to load
  * @returns  js dom object
  */

const render = async fileName => {
	/**
	  * using process.cwd() because noodle can run from any directory
	  * noodle then looks in that directory and builds paths from there
	  * so to create an absolute path requires the CWD + path to file
	  * __dirname would return the path to the project file which would always be the same.
	  */

	// check for allowed files types
	const allowedFileTypes = [
		'.htm',
		'.html',
		'.xht',
		'.xhtml',
		'.xml'
	];
	const fileExt = fileName.slice(fileName.lastIndexOf('.'));

	if (!allowedFileTypes.includes(fileExt))
		throw new Error(
			`${fileExt.toUpperCase()} is not an allowed type : ${allowedFileTypes.join(' ').toUpperCase()}`
		);

	const filePath = path.join(process.cwd(), fileName);
	const dom = await JSDOM.fromFile(filePath, {
		runScripts : 'dangerously', // runs js inside node environment, malicious code has access to machine
		resources  : 'usable' // loads linked js from <script:src>
	});

	/**
		  * By default jsdom resolves the promise as a=soon as the dom is created, it doesnt wait for the scripts to load.
		  * This promise adds the eventlistener to wait for everything to be loaded, and when it is, resolve with the dom object.
		  * Since this promise is awaited in the test file everything works! 
		  */
	return new Promise((resolve, reject) => {
		/**
			  * adds a listener to the document to check if all the content from html has loaded, including scripts
			  */
		dom.window.document.addEventListener('DOMContentLoaded', function() {
			resolve({
				dom,
				window   : dom.window,
				document : dom.window.document
			});
		});
	});
};

module.exports = render;
