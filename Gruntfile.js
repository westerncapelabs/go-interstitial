

module.exports = function (grunt) {
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-mocha-test');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.initConfig({
        paths: {
            src: {
                app: {
                    interstitial: 'src/interstitial.js'
                },
                interstitial: [
                    'src/index.js',
                    '<%= paths.src.app.interstitial %>',
                    'src/init.js'
                ],
                all: [
                    'src/**/*.js'
                ]
            },
            dest: {
                interstitial: 'go-app-interstitial.js'
            },
            test: {
                interstitial: [
                    'test/setup.js',
                    '<%= paths.src.app.interstitial %>',
                    'test/interstitial.test.js'
                ]
            }
        },

        jshint: {
            options: {jshintrc: '.jshintrc'},
            all: [
                'Gruntfile.js',
                '<%= paths.src.all %>'
            ]
        },

        watch: {
            src: {
                files: ['<%= paths.src.all %>'],
                tasks: ['build']
            }
        },

        concat: {
            interstitial: {
                src: ['<%= paths.src.interstitial %>'],
                dest: '<%= paths.dest.interstitial %>'
            }
        },

        mochaTest: {
            options: {
                reporter: 'spec'
            },
            test_interstitial: {
                src: ['<%= paths.test.interstitial %>']
            }
        }
    });

    grunt.registerTask('test', [
        'jshint',
        'build',
        'mochaTest'
    ]);

    grunt.registerTask('build', [
        'concat'
    ]);

    grunt.registerTask('default', [
        'build',
        'test'
    ]);
};