# Noodle
CLI Test Framework for NodeJS and Browser based applications. 

## Table of Contents

* [Introduction](#Introduction)
* [Technologies](#Technologies)
* [How It Works](#How-It-Works)
   * [TME](#TME)
   * [Noodle](#Noodle)
* [Usage](#Usage)
* [Planned Updates](#Planned-Updates)

## Introduction
This project was originally part of a Udemy JavaScript course designed to introduce testing frameworks. The course version would search the project  tree to find `*.test.js`files, require them, and execute the test scripts contained within. 

I noticed some flaws with the time sensitive tests and test environment setup, which, along with my own additions, served as motivation to improve the project for personal use, and to potentially put on NPM. 

## Technologies 
- Common JavaScript 
- Node Version 14

## How It Works!
This section summarises the key features of the course version(TME), the issues found, and the changes made by Noodle to address these issues and add new features.

### TME 
- Breadth first search of project tree for `*.test.js` files. 
- For each file, declares global `it`, `beforeEach` and `render` functions, executes file test scripts. 
- JSDom for browser based app tests
#### Issues
- Only works well for a single test file  
The App logs the name of each test file during loop iteration, tests are then carried out. When multiple test files are used the test results do not correspond to the logged file name. 
- Test environment affected by asynchronously running tests  
When a test uses a `beforeEach` setup but delays using the environment before asserting for completion; a second test can affect the environment, which in turn affects the first test. 
- Global declarations made for every test file found  
Unnecessarily re-declaring global functions for every file.  

### Noodle
#### Issues addressed
- Only works well for a single test file  
Abstracts test scripts into an Object representation of the test file, then awaits the test scripts to complete before loading the next file. 
- Test environment affected by asynchronously running tests  
If test scripts require an environment setup, the tests are executed one by one to ensure the environment is not affected by other tests. Where no environment is required, tests are wrapped up into a `Promise.all()` derived function and executed at the same time. 
- Global declarations made for every test file found  
Moved these functions to the Class Constructor and introduced some new properties to monitor the state of the app
#### Additional Features
- Added statistics object to report on total tests, tests passed/failed, test duration. This appears at the end of the testing run or when the process exits early to avoid scrolling back through console. 
- Test files now run one by one to improve console reporting. 
- Test scripts run synchronously when necessary to avoid contamination of test environment. 
- CLI can be run by specifying the test script or scripts to execute. This allows testing of specific sections of an app
- Hijacked the Console module! User console commands are turned off.
- Implemented a derived version of `Promise.all`where the function waits for all tests to complete, and then returns an array of pass/fail test objects. 

## Usage
This repository contains the original TME application and Noodle. TME can be found in the `udemy` directory.

To use the Noodle CLI clone the repo, run npm link, then navigate to one of the sample project directories and run `noodle`
```
git clone https://github.com/mywifemademejoin/noodle.git
cd noodle
npm link
cd samplenodeproject
noodle
```

To run Noodle without linking
```
git clone https://github.com/mywifemademejoin/noodle.git
cd noodle/samplenodeproject
node ../index.js
```

To use TME run `index.js` form one of the sample project directories
```
git clone https://github.com/mywifemademejoin/noodle.git
cd noodle/udemy/samplenodeproject
node ../index.js
```

Alternatively to run both projects and compare the differences
```
git clone https://github.com/mywifemademejoin/noodle.git
cd noodle
npm run test
```
or run individual tests with one of the following
```
npm run noodle
npm run noodleweb
npm run noodlenode

npm run tme
npm run tmeweb
npm run tmenode
```

## Planned Updates
- Improve test scripts to better highlight the differences between the two versions. 
- Show stats if process exits early
- Enable user console logs and incorporate into stats object and test error reporting. 


