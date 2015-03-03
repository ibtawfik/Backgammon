/**
 * File: PeerReview_jz/karma.conf.js
 * -------------------------------------
 * By: Jingxin Zhu
 * On: 2015.03.02
 * -------------------------------------
 */

module.exports = function(config){
    config.set({

        basePath : './',

        files : [
            'http://ajax.googleapis.com/ajax/libs/angularjs/1.3.8/angular.js',
            'http://ajax.googleapis.com/ajax/libs/angularjs/1.3.8/angular-mocks.js',
            'BackgammonLogicService.js',
            'BackgammonLogicService_test.js'
        ],

        reporters: ['progress', 'coverage'],

        preprocessors: {
            // source files, that you wanna generate coverage for
            // do not include tests or libraries
            // (these files will be instrumented by Istanbul)
            'BackgammonLogicService.js': ['coverage']
        },

        // optionally, configure the reporter
        coverageReporter: {
            type : 'html',
            dir : 'coverage/',
        },

        autoWatch : true,

        frameworks: ['jasmine'],

        browsers : ['Chrome'],

        plugins : [
            'karma-chrome-launcher',
            'karma-jasmine',
            'karma-coverage'
        ]

    });
};
