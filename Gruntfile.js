module.exports = function (grunt) {

  require('jit-grunt')(grunt);
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-jshint');

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    html2js: {
      options: {
        base: 'src/templates',
        indentString: '  '
      },
      wmLoginAngular: {
        src: ['src/templates/**/*.html'],
        dest: 'dist/wmLogin-angular.templates.js'
      },
    },

    less: {
      production: {
        files: {
          "dist/login-angular.css": "src/less/login-angular.less"
        }
      }
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
    'less:production',
    'copy'
  ]);

  grunt.registerTask('dev', [
    'build',
    'watch'
  ]);

};
