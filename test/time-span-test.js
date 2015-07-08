var TimeSpan = require('../src/time-span');
var chai = require("chai");
var assert = chai.assert;
describe("tryParse specification", function () {
    it("without parameters.", function () {
        assert.equal(TimeSpan.tryParse(undefined).totalMilliseconds, 0);
        assert.equal(TimeSpan.tryParse(null).totalMilliseconds, 0);
    });
    it("with timespan parameter should return same instance.", function () {
        var ts = TimeSpan.fromDays(1);
        assert.equal(TimeSpan.tryParse(ts), ts);
    });
    it("with number value.", function () {
        assert.equal(TimeSpan.tryParse(121).totalMilliseconds, 121);
        assert.equal(TimeSpan.tryParse(-121).totalMilliseconds, -121);
        assert.equal(TimeSpan.tryParse(-12.456).totalMilliseconds, -12.456);
        assert.equal(TimeSpan.tryParse(12.456).totalMilliseconds, 12.456);
    });
    it("with float string value.", function () {
        assert.equal(TimeSpan.tryParse("121").totalMilliseconds, 121);
        assert.equal(TimeSpan.tryParse(" 121  ").totalMilliseconds, 121);
        assert.equal(TimeSpan.tryParse("-121").totalMilliseconds, -121);
        assert.equal(TimeSpan.tryParse("-12.456").totalMilliseconds, -12.456);
        assert.equal(TimeSpan.tryParse("12.456").totalMilliseconds, 12.456);
        assert.equal(TimeSpan.tryParse("  12.456  ").totalMilliseconds, 12.456);
        assert.equal(TimeSpan.tryParse("q12.456"), null);
        assert.equal(TimeSpan.tryParse(" 12. 12 "), null);
    });
    it("with time span pattern [+-][days.]hh:mm:ss[.milliseconds].", function () {
        assert.equal(TimeSpan.tryParse("1.2:3:4.5").totalMilliseconds, TimeSpan.from(1, 2, 3, 4, 5, false).totalMilliseconds);
        assert.equal(TimeSpan.tryParse("01.02:03:04.005").totalMilliseconds, TimeSpan.from(1, 2, 3, 4, 5, false).totalMilliseconds);
        assert.equal(TimeSpan.tryParse("02:03:04.005").totalMilliseconds, TimeSpan.from(0, 2, 3, 4, 5, false).totalMilliseconds);
        assert.equal(TimeSpan.tryParse("+01.22:56:59.999").totalMilliseconds, TimeSpan.from(1, 22, 56, 59, 999, false).totalMilliseconds);
        assert.equal(TimeSpan.tryParse("-01.22:56:59.999").totalMilliseconds, TimeSpan.from(1, 22, 56, 59, 999, true).totalMilliseconds);
    });
});
//# sourceMappingURL=time-span-test.js.map