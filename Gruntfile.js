module.exports = function(grunt) {
  'use strict';

  require('load-grunt-tasks')(grunt);
  require('time-grunt')(grunt);
  var jsFileList = [
  '<%= pkg.source %>/js/plugins/transition.js',
  '<%= pkg.source %>/js/plugins/alert.js',
  '<%= pkg.source %>/js/plugins/dropdown.js',
  '<%= pkg.source %>/js/plugins/carousel.js',
  '<%= pkg.source %>/js/plugins/swipe.js',
  '<%= pkg.source %>/js/plugins/iscroll-lite.js',
  '<%= pkg.source %>/js/plugins/jquery.drawer.js',
  '<%= pkg.source %>/js/plugins/jquery.rss.js',
  '<%= pkg.source %>/js/plugins/store.min.js',
  '<%= pkg.source %>/js/plugins/jquery.userfont.js',
  '<%= pkg.source %>/js/scripts.js'
  ];

  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),

    banner:
    '/*!\n' +
    ' * <%= pkg.name %> version <%= pkg.version %>\n' +
    ' * Author : <%= pkg.author %>\n' +
    ' * Homepage : <%= pkg.homepage %>\n' +
    ' * Licensed : <%= pkg.licenses.url %>\n' +
    ' * repository : <%= pkg.repository.url %>\n' +
    ' */\n',
    // ====================================================
    jshint: {
      options: {
        jshintrc: '<%= pkg.source %>/js/.jshintrc'
      },
      all: [
        'Gruntfile.js',
        '<%= pkg.source %>/_scripts.js',
        '!<%= pkg.output %>/*.min.js'
      ]
    },
    csslint: {
      options: {
        csslintrc: '<%= pkg.source %>/css/.csslintrc'
      },
      all: [
      'style.css',
      '<%= pkg.output %>/*.css',
      ]
    },
    // ====================================================
    clean: {
      dist: '<%= pkg.distribution %>'
    },
    // ====================================================
    less: {
      source: {
        options: {
          strictMath: true,
          sourceMap: true,
          outputSourceFiles: true,
          sourceMapURL: ['style.css.map'],
          sourceMapFilename: '<%= pkg.output %>/style.css.map'
        },
        files: {
          '<%= pkg.output %>/app.css': '<%= pkg.source %>/css/app.less',
          '<%= pkg.output %>/ie.css': '<%= pkg.source %>/css/ie/ie.less'
        }
      },
      compress: {
        options: {
          compress: true
        },
        files: {
          '<%= pkg.output %>/app.min.css': '<%= pkg.output %>/app.css',
          '<%= pkg.output %>/ie.min.css': '<%= pkg.output %>/ie.css',
          'style.css': '<%= pkg.output %>/app.css'
        }
      }
    },
    // ====================================================
    autoprefixer: {
      options: {
        browsers: [
        'Android 2.3',
        'Android >= 4',
        'Chrome >= 20',
        'Firefox >= 24', // Firefox 24 is the latest ESR
        'Explorer >= 8',
        'iOS >= 6',
        'Opera >= 12',
        'Safari >= 6'
        ]
      },
      source: {
        options: {
          map: true
        },
        src: '<%= pkg.output %>/app.css'
      }
    },
    // ====================================================
    csscomb: {
      options: {
        config: '<%= pkg.source %>/css/.csscomb.json'
      },
      source: {
        expand: true,
        cwd: '<%= pkg.output %>/',
        src: ['*.css', '!*.min.css'],
        dest: '<%= pkg.output %>/'
      }
    },
    // ====================================================
    usebanner: {
      options: {
        position: 'top',
        banner: '<%= banner %>'
      },
      source: {
        src: '<%= pkg.output %>/*.css'
      }
    },
    // ====================================================
    concat: {
      options: {
        separator: ';',
      },
      dist: {
        src: [jsFileList],
        dest: '<%= pkg.output %>/app.js',
      },
    },
    // ====================================================
    uglify: {
      options: {
        banner: '<%= banner %>',
        report: 'min'
      },
      source:{
        options: {
          indentLevel: 2,
          beautify: true,
          mangle: false,
          compress:false
        },
        files :  {
          '<%= pkg.output %>/app.js' : [jsFileList]
        }
      },
      minify:{
        files :  {
          '<%= pkg.output %>/app.min.js' : [
          '<%= pkg.output %>/app.js'
          ]
        }
      }
    },
    // ====================================================
    copy: {
      js: {
        expand: true,
        cwd: '<%= pkg.output %>',
        src: [
        'app.js',
        'app.min.js',
        ],
        dest: '<%= pkg.distribution %>/js'
      },
      css: {
        expand: true,
        cwd: '<%= pkg.output %>',
        src: [
        'app.css',
        'app.css.map',
        'ie.css'
        ],
        dest: '<%= pkg.distribution %>/css'
      }
    },
    // ====================================================
    notify: {
      options: {
        title: '<%= pkg.name %> Grunt Notify',
      },
      success:{
        options: {
          message: 'Success!',
        }
      }
    },
    // ====================================================
    connect: {
      server: {
        options: {
          port: 8080,
          hostname: 'localhost',
          base: '.',
          livereload: true,
          open: {
            server: {
              path: 'http://<%= connect.server.options.hostname %>:<%= connect.server.options.port %>'
            }
          }
        }
      }
    },
    // ====================================================
    watch: {
      options: {
        spawn: false,
        livereload : true
      },
      less: {
        files: [
          '<%= pkg.source %>/css/*.less',
          '<%= pkg.source %>/css/**/*.less'
        ],
        tasks: [
        'build-less',
        'csslint',
        'notify'
        ]
      },
      js: {
        files: [
          '<%= jshint.all %>'
        ],
        tasks: [
        'jshint',
        'notify'
        ]
      },
      html: {
        files: [
        '*.html'
        ],
        tasks: [
        'notify'
        ]
      },
    }
  });

  // Register tasks
  // ====================================================
  grunt.registerTask('build-less', [
  'less:source',
  'autoprefixer:source',
  'usebanner:source',
  'csscomb:source',
  'less:compress',
  ]);

  // ====================================================
  grunt.registerTask('build-js', [
  'concat',
  'uglify'
  ]);

  // ====================================================
  grunt.registerTask('test', [
  'jshint',
  'csslint',
  ]);

  // ====================================================
  grunt.registerTask('dev', [
  'jshint',
  'csslint',
  'less:source',
  'autoprefixer:source',
  'concat'
  ]);

  // ====================================================
  grunt.registerTask('build', [
  'clean',
  'build-less',
  'build-js',
  'test',
  'copy'
  ]);

  // ====================================================
  grunt.registerTask('default', function () {
    grunt.log.warn('`grunt` to start a watch.');
    grunt.task.run([
      'connect',
      'watch'
    ]);
  });

};
