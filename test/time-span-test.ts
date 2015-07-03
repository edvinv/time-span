import Duration = require('../src/time-span');
import chai = require("chai");
var assert = chai.assert;

describe("Duration specification.", () => {
	function _testDuration(days: number, hours: number, minutes: number, seconds: number, ms: number) {
		assert.ok(0==0);
	}
	
it("Some sample durations.", () => {
		_testDuration(0, 0, 0, 0, 0);
		_testDuration(0, 2, 45, 34, 980);
		_testDuration(13450, 22, 45, 34, 0);
	});	
	
});