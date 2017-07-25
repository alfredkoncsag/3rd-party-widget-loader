var path = require('path');
var lrSnippet = require('grunt-contrib-livereload/lib/utils').livereloadSnippet;
var folderMount = function folderMount(connect, point) {
  return connect.static(path.resolve(point));
};


module.exports = function (grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    requirejs: {
      compile: {
        options: {
          mainConfigFile: "app/js/app.js",
          out: "dist/release/js/app.js",
          name: "app"
        }
      }
    },

    clean: {
      dist: [
        'dist/*'
      ]
    },

    connect: {
      livereload: {
        options: {
          port: 9001,
          hostname: '0.0.0.0',
          middleware: function (connect, options) {
            return [lrSnippet, folderMount(connect, '.')];
          }
        }
      }
    },

    shell: {
      openBrowser: {
        command: 'open http://localhost:<%= connect.livereload.options.port %>/tests/'
      },
      createLoaderFile: {
        command: 'grunt',
        options: {
          stdout: true,
          execOptions: {
            cwd: 'loader'
          }
        }
      }
    },

    regarde: {
      main: {
        files: ['app/**/*.js', '**/*.html'],
        tasks: ['livereload']
      }
    },

    copy: {
      main: {
        files: [
          {
            src: ['app/img/*'],
            dest: 'dist/release/img/',
            flatten: true, expand: true
          },
          {
            src: ['app/css/*'],
            dest: 'dist/release/css/',
            flatten: true, expand: true
          }

        ]
      }
    },
    jshint: {
      options: {
        reporter: require('jshint-stylish'),
        curly: true,
        eqeqeq: true,
        eqnull: true,
        browser: true,
        globals: {
          jQuery: true
        },
      },
      target: ['app/**/*.js']
    },

  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.registerTask('default', ['jshint']);

  grunt.loadNpmTasks('grunt-regarde');
  grunt.loadNpmTasks('grunt-contrib-livereload');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-requirejs');
  grunt.loadNpmTasks('grunt-contrib-jshint');

 // Todo:jshint

  grunt.registerTask('build', ['clean', 'requirejs', 'copy']);
  grunt.registerTask('server', ['livereload-start', 'connect', 'regarde']);
  grunt.registerTask('browser', ['livereload-start', 'connect', 'shell:openBrowser', 'regarde']);
  grunt.registerTask('default', ['server']); 
};


