module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        concat: {
            dist: {
                src: [
                    'js/vendor/kinect.js',
                    'js/vendor/jquery.js',
                    'js/vendor/tappy.js',
                    'js/sections/*.js'
                ],
                dest: 'js/production.js',
            }
        },
        concat_css: {
            options: {
                assetBaseUrl: '../assets',
                baseDir: 'css/(modules|sections|vendor)'
            },
            all: {
                src: ["css/vendor/*.css", "css/modules/*.css", "css/sections/*.css"],
                dest: "css/production.css"
            },
        },
        uglify: {
            my_js: {
                files: {
                    'js/production.min.js': ['js/production.js']
                }
            }
        },
        cssmin: {
            target: {
                files: {
                    'css/production.min.css': ['css/production.css']
                }
          }
        }
    });


    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-concat-css');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');

    grunt.registerTask('default', ['concat', 'concat_css', 'uglify', 'cssmin']);

};