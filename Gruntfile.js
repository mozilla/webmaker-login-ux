module.exports = function (grunt) {
  require('jit-grunt')(grunt, {
    browserify: 'grunt-browserify',
    jshint: 'grunt-contrib-jshint'
  });

  var jshintConfig = grunt.file.readJSON('.jshintrc');

  var allJS = [
    'src/**/*.js',
    'Gruntfile.js'
  ];

  grunt.initConfig({
    browserify: {
      angular: {
        src: ['src/adapters/angular.js'],
        dest: 'dist/ngWebmakerLogin.js'
      },
      plain: {
        src: ['src/adapters/plain.js'],
        dest: 'dist/webmakerLogin.js'
      }
    },
    jshint: {
      files: allJS,
      options: jshintConfig
    },
    jsbeautifier: {
      modify: {
        src: allJS,
        options: {
          config: '.jsbeautifyrc'
        }
      },
      verify: {
        src: allJS,
        options: {
          mode: 'VERIFY_ONLY',
          config: '.jsbeautifyrc'
        }
      }
    },
    uglify: {
      angularAdapter: {
        options: {
          mangle: false
        },
        files: {
          'dist/min/ngWebmakerLogin.min.js': ['dist/ngWebmakerLogin.js']
        }
      },
      plainJsAdapter: {
        options: {
          mangle: false
        },
        files: {
          'dist/min/webmakerLogin.min.js': ['dist/webmakerLogin.js']
        }
      }
    }
  });

  grunt.registerTask('clean', [
    'jsbeautifier:modify'
  ]);

  grunt.registerTask('validate', [
    'jsbeautifier:verify',
    'jshint'
  ]);

  grunt.registerTask('build', [
    'validate',
    'browserify',
    'uglify'
  ]);

  grunt.registerTask('default', [
    'build'
  ]);
};
