module.exports = function (grunt) {

  require('jit-grunt')(grunt, {
    shell: 'grunt-shell-spawn',
    less: 'grunt-contrib-less',
    express: 'grunt-express-server'
  });

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

    express: {
      dev: {
        options: {
          script: 'test/server.js',
          node_env: 'DEV',
          port: ''
        }
      }
    },

    watch: {
      src: {
        files: ['src/**/*', "test/**/*", "locale/**/*"],
        tasks: ['build', 'express'],
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
    'express',
    'watch'
  ]);

  grunt.registerTask('default', [
    'dev'
  ]);
};
