module.exports = function (grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concat: {
            css: {
                src: [
                    'assets-dev/css/**/*.css'
                ],
                dest: 'assets/site.css'
            },
        },
        cssmin: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n',
                keepSpecialComments: 0,
            },
            minify: {
                files: {
                    'assets/site.min.css': 'assets/site.css'
                }
            } // MINIFY
        },
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n\n'
            },
            js: {
                files: {
                    'assets/site.min.js': ['assets-dev/js/**/*.js']
                }
            } // JS
        },
        copy: {
            main: {
                files: [{
                    expand: true,
                    flatten: true,
                    src: ['assets-dev/css/**/*.{jpg,png}'],
                    dest: 'assets/img',
                    filter: 'isFile'
                }]
            }
        },
        imagemin: {
            png: {
                options: {
                    optimizationLevel: 7,
                    pngquant: true
                },
                files: [{
                    expand: true,
                    cwd: "assets/img/",
                    src: ["*.png"],
                    dest: "assets/img/",
                    ext: ".png"
                }]
            }, // PNG
            jpg: {
                options: {
                    progressive: true
                },
                files: [{
                    expand: true,
                    cwd: "assets/img/",
                    src: ["*.jpg"],
                    dest: "assets/img/",
                    ext: ".jpg"
                }]
            } // JPG (has to be separate due to a bug on Windows)
        },
        watch: {
            grunt: {
                files: ['Gruntfile.js']
            },
            css: {
                files: ['assets/**/*.css'],
                tasks: ['concat', 'cssmin'],
            }, // CSS
            js: {
                files: ['assets-dev/**/*.js'],
                tasks: ['uglify:js'],
            } // JS
        }
    });
    grunt.loadNpmTasks('grunt-contrib-imagemin');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-sass');
    grunt.registerTask('build', ['concat', 'cssmin', 'uglify:js', 'copy', 'imagemin']);
    grunt.registerTask('default', ['build', 'watch']);
};