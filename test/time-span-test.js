var time_span_1 = require('../src/time-span');
var chai = require("chai");
var expect = chai.expect;
var millisecond = 1, second = 1000 * millisecond, minute = 60 * second, hour = 60 * minute, day = 24 * hour;
describe("Constructor and set are using tryParse", function () {
    it("so just do some simple tests.", function () {
        expect(new time_span_1.default().totalMilliseconds).to.be.equal(0);
        expect(new time_span_1.default(1234).totalMilliseconds).to.be.equal(1234);
        expect(new time_span_1.default(1234.23).totalMilliseconds).to.be.equal(1234);
        expect(new time_span_1.default(1234.56).totalMilliseconds).to.be.equal(1235);
        var ts = new time_span_1.default();
        expect(ts.set("1:2:3.4").totalMilliseconds).to.be.equal(4 + 1000 * (3 + 60 * (2 + 60 * 1)));
    });
});
describe("TimeSpan instantiation", function () {
    it("from miliseconds, seconds... etc", function () {
        expect(time_span_1.default.fromMilliseconds(0).totalMilliseconds).to.be.equal(0);
        expect(time_span_1.default.fromMilliseconds(1).totalMilliseconds).to.be.equal(1);
        expect(time_span_1.default.fromMilliseconds(-1).totalMilliseconds).to.be.equal(-1);
        expect(time_span_1.default.fromMilliseconds(-1637.1).totalMilliseconds).to.be.equal(-1637);
        expect(time_span_1.default.fromMilliseconds(-1637.89).totalMilliseconds).to.be.equal(-1638);
        expect(time_span_1.default.fromMilliseconds(23459.12).totalMilliseconds).to.be.equal(23459);
        expect(time_span_1.default.fromMilliseconds(23459.86).totalMilliseconds).to.be.equal(23460);
    });
    it("from Date difference.", function () {
        var d1 = new Date(2015, 1, 1, 11, 23, 56, 44), d2 = new Date(2015, 1, 1, 11, 23, 55, 23);
        expect(time_span_1.default.fromDateDiff(d1, d2).totalMilliseconds).to.be.equal(1021);
        expect(time_span_1.default.fromDateDiff(d2, d1).totalMilliseconds).to.be.equal(-1021);
        expect(time_span_1.default.fromDateDiff(d2, d2).totalMilliseconds).to.be.equal(0);
    });
});
describe("Check TimeSpan parts get/set:", function () {
    it("milliseconds", function () {
        var ts;
        expect(new time_span_1.default(1234).milliseconds).to.be.equal(234);
        expect(new time_span_1.default(-1234).milliseconds).to.be.equal(234);
        expect(new time_span_1.default(1234.23).milliseconds).to.be.equal(234);
        expect(new time_span_1.default(1234.51).milliseconds).to.be.equal(235);
        expect(new time_span_1.default(-5235.23).milliseconds).to.be.equal(235);
        expect(new time_span_1.default(-5235.51).milliseconds).to.be.equal(236);
        ts = new time_span_1.default("00:10.123");
        ts.milliseconds = 10;
        expect(ts.totalMilliseconds).to.be.equal(10 * second + 10);
        ts = new time_span_1.default("00:10.123");
        ts.milliseconds = 987;
        expect(ts.totalMilliseconds).to.be.equal(10 * second + 987);
        ts = new time_span_1.default("-00:10.123");
        ts.milliseconds = 10;
        expect(ts.totalMilliseconds).to.be.equal(-(10 * second + 10));
        ts = new time_span_1.default("-00:10.123");
        ts.milliseconds = 987;
        expect(ts.totalMilliseconds).to.be.equal(-(10 * second + 987));
        expect(function () { return ts.milliseconds = -1; }).to.throw(Error);
        expect(function () { return ts.milliseconds = 1000; }).to.throw(Error);
        expect(function () { return ts.milliseconds = 33.01; }).to.throw(Error);
    });
    it("seconds", function () {
        var ts;
        expect(new time_span_1.default(1234).seconds).to.be.equal(1);
        expect(new time_span_1.default(-1234).seconds).to.be.equal(1);
        expect(new time_span_1.default(1234.34).seconds).to.be.equal(1);
        expect(new time_span_1.default(-1234.34).seconds).to.be.equal(1);
        ts = new time_span_1.default("00:6.123");
        ts.seconds = 10;
        expect(ts.totalMilliseconds).to.be.equal(10 * second + 123);
        ts = new time_span_1.default("00:6.123");
        ts.seconds = 5;
        expect(ts.totalMilliseconds).to.be.equal(5 * second + 123);
        ts = new time_span_1.default("-00:6.123");
        ts.seconds = 10;
        expect(ts.totalMilliseconds).to.be.equal(-(10 * second + 123));
        ts = new time_span_1.default("-00:6.123");
        ts.seconds = 5;
        expect(ts.totalMilliseconds).to.be.equal(-(5 * second + 123));
        expect(function () { return ts.seconds = -1; }).to.throw(Error);
        expect(function () { return ts.seconds = 60; }).to.throw(Error);
        expect(function () { return ts.seconds = 1.23; }).to.throw(Error);
    });
    it("minutes", function () {
        var ts;
        expect(new time_span_1.default(61234).minutes).to.be.equal(1);
        expect(new time_span_1.default(-61234).minutes).to.be.equal(1);
        expect(new time_span_1.default(61234.34).minutes).to.be.equal(1);
        expect(new time_span_1.default(-61234.34).minutes).to.be.equal(1);
        ts = new time_span_1.default("6:6.123");
        ts.minutes = 10;
        expect(ts.totalMilliseconds).to.be.equal(10 * minute + 6 * second + 123);
        ts = new time_span_1.default("6:6.123");
        ts.minutes = 5;
        expect(ts.totalMilliseconds).to.be.equal(5 * minute + 6 * second + 123);
        ts = new time_span_1.default("-6:6.123");
        ts.minutes = 10;
        expect(ts.totalMilliseconds).to.be.equal(-(10 * minute + 6 * second + 123));
        ts = new time_span_1.default("-6:6.123");
        ts.minutes = 5;
        expect(ts.totalMilliseconds).to.be.equal(-(5 * minute + 6 * second + 123));
        expect(function () { return ts.minutes = -1; }).to.throw(Error);
        expect(function () { return ts.minutes = 60; }).to.throw(Error);
        expect(function () { return ts.minutes = 1.23; }).to.throw(Error);
    });
    it("hours", function () {
        var ts;
        expect(new time_span_1.default(3600123).hours).to.be.equal(1);
        expect(new time_span_1.default(-3600123).hours).to.be.equal(1);
        expect(new time_span_1.default(3600123.34).hours).to.be.equal(1);
        expect(new time_span_1.default(-3600123.34).hours).to.be.equal(1);
        ts = new time_span_1.default("6:10:10.123");
        ts.hours = 10;
        expect(ts.totalMilliseconds).to.be.equal(10 * hour + 10 * minute + 10 * second + 123);
        ts = new time_span_1.default("6:10:10.123");
        ts.hours = 5;
        expect(ts.totalMilliseconds).to.be.equal(5 * hour + 10 * minute + 10 * second + 123);
        ts = new time_span_1.default("-6:10:10.123");
        ts.hours = 10;
        expect(ts.totalMilliseconds).to.be.equal(-(10 * hour + 10 * minute + 10 * second + 123));
        ts = new time_span_1.default("-6:10:10.123");
        ts.hours = 5;
        expect(ts.totalMilliseconds).to.be.equal(-(5 * hour + 10 * minute + 10 * second + 123));
        expect(function () { return ts.hours = -1; }).to.throw(Error);
        expect(function () { return ts.hours = 24; }).to.throw(Error);
        expect(function () { return ts.hours = 1.34; }).to.throw(Error);
    });
    it("days", function () {
        var ts;
        expect(new time_span_1.default(87403000).days).to.be.equal(1);
        expect(new time_span_1.default(-87403000).days).to.be.equal(1);
        expect(new time_span_1.default(87403000.34).days).to.be.equal(1);
        expect(new time_span_1.default(-87403000.34).days).to.be.equal(1);
        ts = new time_span_1.default("6:10:10.123");
        ts.days = 10;
        expect(ts.totalMilliseconds).to.be.equal(10 * day + 6 * hour + 10 * minute + 10 * second + 123);
        ts = new time_span_1.default("6:10:10.123");
        ts.days = 5;
        expect(ts.totalMilliseconds).to.be.equal(5 * day + 6 * hour + 10 * minute + 10 * second + 123);
        ts = new time_span_1.default("-6:10:10.123");
        ts.days = 10;
        expect(ts.totalMilliseconds).to.be.equal(-(10 * day + 6 * hour + 10 * minute + 10 * second + 123));
        ts = new time_span_1.default("-6:10:10.123");
        ts.days = 5;
        expect(ts.totalMilliseconds).to.be.equal(-(5 * day + 6 * hour + 10 * minute + 10 * second + 123));
        expect(function () { return ts.days = -1; }).to.throw(Error);
        expect(function () { return ts.hours = 1.34; }).to.throw(Error);
    });
});
describe("tryParse specification", function () {
    it("without parameters.", function () {
        expect(time_span_1.default.tryParse(undefined).totalMilliseconds).to.be.equal(0);
        expect(time_span_1.default.tryParse(null).totalMilliseconds).to.be.equal(0);
    });
    it("with timespan parameter should return new instance.", function () {
        var ts = time_span_1.default.fromDays(1);
        expect(time_span_1.default.tryParse(ts)).not.equal(ts);
        expect(time_span_1.default.tryParse(ts).totalMilliseconds).equal(ts.totalMilliseconds);
    });
    it("with number value.", function () {
        expect(time_span_1.default.tryParse(121).totalMilliseconds).to.be.equal(121);
        expect(time_span_1.default.tryParse(-121).totalMilliseconds).to.be.equal(-121);
        expect(time_span_1.default.tryParse(-12.456).totalMilliseconds).to.be.equal(-12);
        expect(time_span_1.default.tryParse(12.456).totalMilliseconds).to.be.equal(12);
        expect(time_span_1.default.tryParse(-12.956).totalMilliseconds).to.be.equal(-13);
        expect(time_span_1.default.tryParse(12.756).totalMilliseconds).to.be.equal(13);
    });
    it("with valid total milliseconds as string value.", function () {
        expect(time_span_1.default.tryParse("0").totalMilliseconds).to.be.equal(0);
        expect(time_span_1.default.tryParse("0011").totalMilliseconds).to.be.equal(11);
        expect(time_span_1.default.tryParse("121").totalMilliseconds).to.be.equal(121);
        expect(time_span_1.default.tryParse("-121").totalMilliseconds).to.be.equal(-121);
        expect(time_span_1.default.tryParse("+121").totalMilliseconds).to.be.equal(121);
    });
    it("with invalid total milliseconds as string value.", function () {
        expect(time_span_1.default.tryParse("1.121")).to.be.null;
        expect(time_span_1.default.tryParse("1a121")).to.be.null;
        expect(time_span_1.default.tryParse(" 121")).to.be.null;
        expect(time_span_1.default.tryParse("121 ")).to.be.null;
        expect(time_span_1.default.tryParse("- 121")).to.be.null;
        expect(time_span_1.default.tryParse("-+121")).to.be.null;
    });
    it("with valid string value for pattern [+-][days.]hh:mm:ss[.milliseconds].", function () {
        expect(time_span_1.default.tryParse("34:56").totalMilliseconds).to.be.equal(time_span_1.default.from(0, 0, 34, 56, 0, false).totalMilliseconds);
        expect(time_span_1.default.tryParse("34:56.456").totalMilliseconds).to.be.equal(time_span_1.default.from(0, 0, 34, 56, 456, false).totalMilliseconds);
        expect(time_span_1.default.tryParse("1:34:56").totalMilliseconds).to.be.equal(time_span_1.default.from(0, 1, 34, 56, 0, false).totalMilliseconds);
        expect(time_span_1.default.tryParse("1.2:3:4.5").totalMilliseconds).to.be.equal(time_span_1.default.from(1, 2, 3, 4, 5, false).totalMilliseconds);
        expect(time_span_1.default.tryParse("01.02:03:04.005").totalMilliseconds).to.be.equal(time_span_1.default.from(1, 2, 3, 4, 5, false).totalMilliseconds);
        expect(time_span_1.default.tryParse("02:03:04.005").totalMilliseconds).to.be.equal(time_span_1.default.from(0, 2, 3, 4, 5, false).totalMilliseconds);
        expect(time_span_1.default.tryParse("+01.22:56:59.999").totalMilliseconds).to.be.equal(time_span_1.default.from(1, 22, 56, 59, 999, false).totalMilliseconds);
        expect(time_span_1.default.tryParse("-01.22:56:59.999").totalMilliseconds).to.be.equal(time_span_1.default.from(1, 22, 56, 59, 999, true).totalMilliseconds);
    });
    it("with invalid string value for pattern [+-][days.]hh:mm:ss[.milliseconds].", function () {
        expect(time_span_1.default.tryParse("00:60")).to.be.null;
        expect(time_span_1.default.tryParse("60:00")).to.be.null;
        expect(time_span_1.default.tryParse("25:00:00")).to.be.null;
        expect(time_span_1.default.tryParse("30:00:00")).to.be.null;
        expect(time_span_1.default.tryParse("00:00:00.1000")).to.be.null;
    });
});
describe("TimeSpan operations", function () {
    it("like addition, substraction etc...", function () {
        expect(time_span_1.default.fromMilliseconds(1567).negate().totalMilliseconds).to.be.equal(-1567);
        expect(time_span_1.default.fromMilliseconds(1567).add(time_span_1.default.fromMilliseconds(-1567)).totalMilliseconds).to.be.equal(0);
        expect(time_span_1.default.fromMilliseconds(1567).substract(time_span_1.default.fromMilliseconds(-1567)).totalMilliseconds).to.be.equal(3134);
        expect(time_span_1.default.fromMilliseconds(1567).addMilliseconds(2.1).totalMilliseconds).to.be.equal(1569);
        ;
        expect(time_span_1.default.fromMilliseconds(1567).addMilliseconds(-2.9).totalMilliseconds).to.be.equal(1564);
        ;
        expect(time_span_1.default.fromMilliseconds(1567).addSeconds(2.1).totalMilliseconds).to.be.equal(3667);
        ;
        expect(time_span_1.default.fromMilliseconds(1567).addSeconds(-2.1).totalMilliseconds).to.be.equal(-533);
        ;
        expect(time_span_1.default.fromMilliseconds(1567).addMinutes(2.1).totalMilliseconds).to.be.equal(127567);
        ;
        expect(time_span_1.default.fromMilliseconds(1567).addHours(2.1).totalMilliseconds).to.be.equal(7561567);
        ;
        expect(time_span_1.default.fromMilliseconds(1567).addDays(-2.1).totalMilliseconds).to.be.equal(-181438433);
        ;
    });
});
describe("TimeSpan comparison", function () {
    it("like compare, equal, less etc...", function () {
        expect(time_span_1.default.compare(time_span_1.default.fromMilliseconds(0), time_span_1.default.fromMilliseconds(0))).to.be.equal(0);
        expect(time_span_1.default.compare(time_span_1.default.fromMilliseconds(-4), time_span_1.default.fromMilliseconds(-2))).to.be.equal(-1);
        expect(time_span_1.default.compare(time_span_1.default.fromMilliseconds(4), time_span_1.default.fromMilliseconds(2))).to.be.equal(1);
        expect(time_span_1.default.equal(time_span_1.default.fromMilliseconds(-42), time_span_1.default.fromMilliseconds(-42))).to.be.true;
        expect(time_span_1.default.equal(time_span_1.default.fromMilliseconds(-42), time_span_1.default.fromMilliseconds(42))).to.be.false;
        expect(time_span_1.default.more(time_span_1.default.fromMilliseconds(-42), time_span_1.default.fromMilliseconds(-42))).to.be.false;
        expect(time_span_1.default.more(time_span_1.default.fromMilliseconds(-41), time_span_1.default.fromMilliseconds(-42))).to.be.true;
        expect(time_span_1.default.moreOrEqual(time_span_1.default.fromMilliseconds(42), time_span_1.default.fromMilliseconds(42))).to.be.true;
        expect(time_span_1.default.moreOrEqual(time_span_1.default.fromMilliseconds(-41), time_span_1.default.fromMilliseconds(-42))).to.be.true;
        expect(time_span_1.default.moreOrEqual(time_span_1.default.fromMilliseconds(-43.1), time_span_1.default.fromMilliseconds(-42))).to.be.false;
        expect(time_span_1.default.less(time_span_1.default.fromMilliseconds(-42), time_span_1.default.fromMilliseconds(-42))).to.be.false;
        expect(time_span_1.default.less(time_span_1.default.fromMilliseconds(-43), time_span_1.default.fromMilliseconds(-42))).to.be.true;
        expect(time_span_1.default.lessOrEqual(time_span_1.default.fromMilliseconds(42), time_span_1.default.fromMilliseconds(42))).to.be.true;
        expect(time_span_1.default.lessOrEqual(time_span_1.default.fromMilliseconds(-45), time_span_1.default.fromMilliseconds(-42))).to.be.true;
        expect(time_span_1.default.lessOrEqual(time_span_1.default.fromMilliseconds(-43.1), time_span_1.default.fromMilliseconds(-43))).to.be.true;
    });
    it("like isZero, isPositive and isNegative.", function () {
        expect(time_span_1.default.fromMilliseconds(0).isZero).to.be.true;
        expect(time_span_1.default.fromMilliseconds(1).isZero).not.to.be.true;
        expect(time_span_1.default.fromMilliseconds(0).isPositive).not.to.be.true;
        expect(time_span_1.default.fromMilliseconds(1).isPositive).to.be.true;
        expect(time_span_1.default.fromMilliseconds(-1).isPositive).not.to.be.true;
        expect(time_span_1.default.fromMilliseconds(0).isNegative).not.to.be.true;
        expect(time_span_1.default.fromMilliseconds(1).isNegative).not.to.be.true;
        expect(time_span_1.default.fromMilliseconds(-1).isNegative).to.be.true;
    });
});
describe("TimeSpan formatting", function () {
    it("with default  pattern.", function () {
        expect(time_span_1.default.from(1, 2, 3, 4, 5, false).toString()).to.be.equal("1.02:03:04.005");
        expect(time_span_1.default.from(11, 22, 33, 44, 123, false).toString()).to.be.equal("11.22:33:44.123");
        expect(time_span_1.default.from(1, 1, 1, 1, 11, true).toString()).to.be.equal("-1.01:01:01.011");
        expect(time_span_1.default.from(12, 12, 12, 12, 123, true).toString()).to.be.equal("-12.12:12:12.123");
    });
    it("with manadatory '+' sign.", function () {
        expect(time_span_1.default.from(1, 1, 1, 1, 1, false).toString("%+%d.%hh:%mm:%ss.%t")).to.be.equal("+1.01:01:01.1");
        expect(time_span_1.default.from(12, 12, 12, 12, 123, false).toString("%+%d.%hh:%mm:%ss.%t")).to.be.equal("+12.12:12:12.123");
        expect(time_span_1.default.from(12, 12, 12, 12, 123, true).toString("%+%d.%hh:%mm:%ss.%t")).to.be.equal("-12.12:12:12.123");
    });
    it("with custom pattern.", function () {
        expect(time_span_1.default.from(1, 2, 3, 4, 5, false).toString("%%")).to.be.equal("%");
        expect(time_span_1.default.from(1, 2, 3, 4, 5, false).toString("%%%%")).to.be.equal("%%");
        expect(time_span_1.default.from(1, 2, 3, 4, 5, false).toString("%+%d.%h:%m:%s.%t")).to.be.equal("+1.2:3:4.5");
        expect(time_span_1.default.from(1, 2, 3, 4, 789, false).toString("%t")).to.be.equal("789");
        expect(time_span_1.default.from(1, 2, 3, 4, 789, false).toString("%tt")).to.be.equal("789");
        expect(time_span_1.default.from(1, 2, 3, 4, 9, false).toString("%tt")).to.be.equal("009");
        expect(time_span_1.default.from(1, 2, 3, 4, 9, false).toString("%d%hh%mm%ss%tt")).to.be.equal("1020304009");
    });
    it("invalide pattern.", function () {
        expect(function () { return time_span_1.default.from(1, 1, 1, 1, 1, false).toString("%"); }).to.throw(Error);
        expect(function () { return time_span_1.default.from(1, 1, 1, 1, 1, false).toString("%t%"); }).to.throw(Error);
        expect(function () { return time_span_1.default.from(1, 1, 1, 1, 1, false).toString("%%%"); }).to.throw(Error);
    });
});
//# sourceMappingURL=time-span-test.js.map