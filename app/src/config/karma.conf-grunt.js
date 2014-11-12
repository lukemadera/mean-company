
module.exports = function (config) {
	config.set({
		basePath: '../',

		files: [
			//we need jQuery for test selectors (using 'find()'). NOTE: jquery must be included BEFORE angular for it to work (otherwise angular will just use jqLite)
			'test/lib/jquery/jquery-2.1.1.min.js',
			
			<%
			var filePaths = grunt.config('filePathsJsNoPrefix');
			for(var ii=0; ii<filePaths.length; ii++) {
				if(ii !=0) {
					print('\t\t\t');
				}
				print('"'+filePaths[ii] + '",\n');
			}
			%>
		
			// 'lib/angular/angular-*.js',
			'bower_components/angular-mocks/angular-mocks.js',

			// 'test/unit/**/*.js',
			
			// Test-Specs
			// '**/*.spec.js'
			// '**/spec.*.js'
			<%
			var filePaths = grunt.config('filePathsJsTestUnitNoPrefix');
			for(var ii=0; ii<filePaths.length; ii++) {
				if(ii !=0) {
					print('\t\t\t');
				}
				print('"'+filePaths[ii] + '",\n');
			}
			%>
		],

		frameworks: ['jasmine'],

		autoWatch: true,

		// browsers: ['Chrome'],
		browsers: [],

		junitReporter: {
			outputFile: 'test_out/unit.xml',
			suite: 'unit'
		},
		
		//code coverage (with Instanbul - built into Karma)
		preprocessors: {
			// '**/*.js':['coverage']
			<%
			var filePaths = grunt.config('filePathsJsTest.karmaUnitCoverage');
			for(var ii=0; ii<filePaths.length; ii++) {
				if(ii !=0) {
					print('\t\t\t');
				}
				print('"'+filePaths[ii] + '":["coverage"],\n');
			}
			%>
		},
		reporters: ['coverage'],
		coverageReporter: {
			//need to SEPARATELY generate json file now after karma v0.10.10 and karma-coverage v.0.1.2 - https://github.com/karma-runner/karma-coverage/pull/82
			reporters: [
				{
					type: 'html',
					// type: 'lcov',
					dir: 'coverage-angular/'
				},
				{
					type: 'json',
					dir: 'coverage-angular/'
				}
			]
		}
		
	});
};