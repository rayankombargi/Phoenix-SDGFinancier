const fs = require('fs');

class DetailedTextReporter {
  onRunComplete(contexts, results) {
    let output = "";

    // Overall summary
    output += `Overall Test Summary:\n`;
    output += `Test Suites: ${results.numPassedTestSuites} passed, ${results.numFailedTestSuites} failed, ${results.numTotalTestSuites} total\n`;
    output += `Tests: ${results.numPassedTests} passed, ${results.numFailedTests} failed, ${results.numTotalTests} total\n`;
    output += `Snapshots: ${results.numPassedSnapshots} passed, ${results.numFailedSnapshots} failed, ${results.numTotalSnapshots} total\n`;
    output += `Total Runtime: ${results.runtime} ms\n\n`;

    // Details for each test suite
    results.testResults.forEach(suite => {
      output += `Suite: ${suite.displayName || suite.name}\n`;
      
      // Include console logs if present
      if (suite.console && suite.console.length > 0) {
        output += `  Console Output:\n`;
        suite.console.forEach(log => {
          // log.message might be an array of strings; join them if needed.
          output += `    ${Array.isArray(log.message) ? log.message.join(' ') : log.message}\n`;
        });
      }
      
      suite.testResults.forEach(test => {
        output += `  Test: ${test.fullName}\n`;
        output += `    Status: ${test.status.toUpperCase()}\n`;
        if (test.status === 'failed') {
          test.failureMessages.forEach(msg => {
            output += `    Error: ${msg}\n`;
          });
        }
      });
      output += "\n";
    });

    // Write the detailed output to a text file
    fs.writeFileSync('detailed-test-results.txt', output, 'utf8');
    console.log('\nDetailed test results written to detailed-test-results.txt');
  }
}

module.exports = DetailedTextReporter;
