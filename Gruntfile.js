/* jslint node:true */
'use strict';
var path = require('path');


module.exports = function(grunt) {

    var BIND_PORT = 8000;
    var BIND_ALL_INTERFACES = false;
    var BACKEND_HOST = '127.0.0.1';
    var BACKEND_PORT = 8001;
    var WATCH_FILE_PATH = path.join(__dirname, '.rebooted');

    require('load-grunt-tasks')(grunt);

    grunt.registerTask('default', [
        'serve'
    ]);

    grunt.registerTask('serve', [
        'configureProxies:server',
        'connect:server',
        'concurrent:dev',
    ]);

    grunt.initConfig({
        //
        pkg: grunt.file.readJSON('package.json'),

        concurrent: {
            dev: {
                tasks: ['nodemon:tornado_app', 'watch'],
                options: {
                    logConcurrentOutput: true
                }
            }
        },

        nodemon: {
            tornado_app: {
                options: {
                    exec: 'python/bin/python server/tornado_app.py',
                    watch: ['**/*.py', 'templates/**/*.html'],
                    ext: 'py html',
                    cwd: __dirname,
                    callback: nodemonHooks(WATCH_FILE_PATH, BIND_PORT)
                }
            }
        },

        watch: {
            server: {
                files: [WATCH_FILE_PATH],
                options: {
                    livereload: true
                }
            },
            css: {
                files: ['static/**/*.css'],
                options: {
                    livereload: true
                }
            },
            js: {
                files: ['static/**/*.js'],
                options: {
                    livereload: true
                }
            },
            config: {
                files: ['Gruntfile.js', 'package.json'],
                options: {
                    reload: true
                }
            }
        },

        connect: {
            server: {
                options: {
                    port: BIND_PORT,
                    hostname: BIND_ALL_INTERFACES ? '*' : 'localhost',
                    livereload: true,
                    middleware: function(connect, options, middlewares) {
                        middlewares.unshift(
                            require('grunt-connect-proxy/lib/utils').proxyRequest
                        );
                        return middlewares;
                    }
                },
                proxies: [{
                    context: ['!/static', '/'],
                    host: BACKEND_HOST,
                    port: BACKEND_PORT,
                    https: false,
                    changeOrigin: false,
                    xforward: false
                }]
            }
        }
    });

};


function nodemonHooks(watchFilePath, bindPort) {
    return function(nodemon) {
        nodemon.on('log', function(event) {
            console.log(event.colour);
        });
        nodemon.on('restart', function() {
            // Delay before server listens on port
            setTimeout(function() {
                require('fs').writeFileSync(watchFilePath, 'rebooted');
            }, 1000);
        });
        // opens browser on initial server start
        nodemon.on('config:update', function() {
            // Delay before server listens on port
            setTimeout(function() {
                require('open')('http://localhost:' + bindPort + '/');
            }, 1000);
        });
    };
}
