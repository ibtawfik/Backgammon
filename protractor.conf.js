exports.config = {
  specs: [
      'end_to_end_tests.js'
      //'end_to_end_tests_Jingxin.js'
      ],
  allScriptsTimeout: 11000,
  directConnect: true, // only works with Chrome and Firefox
  capabilities: {
    'browserName': 'chrome'
  },
  baseUrl: 'http://localhost:9000/',
  framework: 'jasmine',
  jasmineNodeOpts: {
    defaultTimeoutInterval: 30000
  }

};
