const path = require('path');

// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html

const reporters = ['dots', 'kjhtml'];

if (process.env.CI === 'true') {
	reporters.push('junit');
}

console.log('Running Karma with reporters:', reporters);

module.exports = function(config) {
	config.set({
		basePath: '',
		frameworks: ['jasmine', '@angular-devkit/build-angular'],
		plugins: [
			require('karma-jasmine'),
			require('karma-chrome-launcher'),
			require('karma-jasmine-html-reporter'),
			require('karma-junit-reporter'),
			require('karma-coverage-istanbul-reporter'),
			require('@angular-devkit/build-angular/plugins/karma'),
		],
		client: {
			clearContext: false, // leave Jasmine Spec Runner output visible in browser
		},
		coverageIstanbulReporter: {
			dir: path.join(__dirname, '../../coverage'),
			reports: ['html', 'lcovonly'],
			fixWebpackSourcePaths: true,
		},
		reporters,
		junitReporter: {
			outputDir: path.join(__dirname, '../../reports/karma'),
			outputFile: 'results.xml',
			useBrowserName: false,
		},
		port: 9876,
		colors: true,
		logLevel: config.LOG_INFO,
		autoWatch: true,
		browsers: ['ChromeHeadless'],
		singleRun: true,
		// Uncomment the line below to output the names of tests slower than the threshold (in milliseconds)
		// reportSlowerThan: 100,
	});
};
