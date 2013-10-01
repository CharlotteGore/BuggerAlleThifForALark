module.exports = function(grunt){
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		mochaTest : {
			options : {
				'reporter' : 'spec'		
			},
			src : ['test/**/*.js']
		},
		jshint : {
			files : ['index.js', 'local/**/*.js']			
		},
		watch : {
			files : ["index.js", "local/*.js"],
			tasks : ['jshint', 'mochaTest']				
		}
	});
	grunt.loadNpmTasks('grunt-mocha-test');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.registerTask('test', 'mochaTest');
	grunt.registerTask('default', ['jshint', 'mochaTest']);
}
