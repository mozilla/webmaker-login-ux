module.exports = function (grunt) {

  require('jit-grunt')(grunt);

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    html2js: {
      options: {
        base: 'src/templates',
        indentString: '  '
      },
      makeApiAngular: {
        src: ['src/templates/**/*.html'],
        dest: 'dist/wmLogin-angular.templates.js'
      },
    },

    copy: {
      main: {
        files: [{
          src: 'src/wmLogin-angular.js',
          dest: 'dist/wmLogin-angular.js'
        }]
      }
    },

    watch: {
      src: {
        files: ['src/**/*'],
        tasks: ['build'],
        options: {
          spawn: false
        }
      }
    }

  });

  grunt.registerTask('build', [
    'html2js',
    'copy'
  ]);

  grunt.registerTask('dev', [
    'build',
    'watch'
  ]);

};
