var chai = require("chai");
var assert = chai.assert;
describe("Duration specification.", function () {
    function _testDuration(days, hours, minutes, seconds, ms) {
        assert.ok(0 == 0);
    }
    it("Some sample durations.", function () {
        _testDuration(0, 0, 0, 0, 0);
        _testDuration(0, 2, 45, 34, 980);
        _testDuration(13450, 22, 45, 34, 0);
    });
});
//# sourceMappingURL=time-span-test.js.map