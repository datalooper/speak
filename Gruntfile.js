module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
      shell: {
          renderHBS: {
              command: 'handlebars js/speakplayer/templates/*.* -f js/templates.js'
          }
      },
    sass: {
      options: {
        includePaths: ['bower_components/foundation/scss']
      },
      dist: {
        options: {
          outputStyle: 'compressed',
          sourceMap: false
        },
        files: {
          'css/app.css': 'scss/app.scss'
        }        
      }
    },

    copy: {
      scripts: {
        expand: true,
        cwd: 'bower_components/',
        src: '**/*.js',
        dest: 'js'
      },

      maps: {
        expand: true,
        cwd: 'bower_components/',
        src: '**/*.map',
        dest: 'js'
      }
    },

    uglify: {
      dist: {
        files: {
          'js/modernizr/modernizr.min.js': ['js/modernizr/modernizr.js']
        }
      }
    },

    concat: {
      options: {
        separator: ';'
      },
      dist: {
        src: [
        'js/foundation/js/foundation.min.js',
        'js/init-foundation.js',
        'js/speakplayer/SpeakPlayer.js',
            'js/speakplayer/SpeakPlayer.Song.js',
            'js/speakplayer/SpeakPlayer.Seekbar.js',
            'js/speakplayer/SpeakPlayer.Library.js',
            'js/speakplayer/SpeakPlayer.Volumeslider.js',
            'js/speakplayer/SpeakPlayer.Playlist.js',
            'js/speakplayer/SpeakPlayer.Player.js',

        ],

        dest: 'js/app.js',
      },

    },
    autoprefixer: {
      dist: {
        files: {
          'css/app.css': 'css/app.css'
        }
      }
    },
    watch: {
      grunt: { files: ['Gruntfile.js'] },
      sass: {
        files: 'scss/**/*.scss',
        tasks: ['sass']
        
      },
    shell: {
        files : 'js/speakplayer/templates/*.*',
        tasks: ['shell']
    },
      livereload: { 
        files: ['*.html', 'js/**/*.{js,json}', 'css/*.css','img/**/*.{png,jpg,jpeg,gif,webp,svg}'], 
        options: { 
          livereload: true 
        } 
      },
      concat: {
        files: ['js/speakplayer/*.js'],
        tasks: 'compileJS',
        options: {
          spawn: false,
        },
      }
    }
  });

grunt.loadNpmTasks('grunt-sass');
grunt.loadNpmTasks('grunt-shell');
grunt.loadNpmTasks('grunt-autoprefixer');
grunt.loadNpmTasks('grunt-contrib-watch');
grunt.loadNpmTasks('grunt-contrib-concat');
grunt.loadNpmTasks('grunt-contrib-copy');
grunt.loadNpmTasks('grunt-contrib-uglify');

grunt.registerTask('build', ['sass']);
grunt.registerTask('default', ['copy', 'uglify', 'concat', 'watch', 'shell:renderHBS']);
grunt.registerTask('compileJS',['concat:dist']);

}