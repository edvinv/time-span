var TimeSpan = require('../src/time-span');
var chai = require("chai");
var expect = chai.expect;
var millisecond = 1, second = 1000 * millisecond, minute = 60 * second, hour = 60 * minute, day = 24 * hour;
describe("Constructor and set are using tryParse", function () {
    it("so just do some simple tests.", function () {
        expect(new TimeSpan().totalMilliseconds).to.be.equal(0);
        expect(new TimeSpan(1234).totalMilliseconds).to.be.equal(1234);
        expect(new TimeSpan(1234.23).totalMilliseconds).to.be.equal(1234);
        expect(new TimeSpan(1234.56).totalMilliseconds).to.be.equal(1235);
        var ts = new TimeSpan();
        expect(ts.set("1:2:3.4").totalMilliseconds).to.be.equal(4 + 1000 * (3 + 60 * (2 + 60 * 1)));
    });
});
describe("TimeSpan instantiation", function () {
    it("from miliseconds, seconds... etc", function () {
        expect(TimeSpan.fromMilliseconds(0).totalMilliseconds).to.be.equal(0);
        expect(TimeSpan.fromMilliseconds(1).totalMilliseconds).to.be.equal(1);
        expect(TimeSpan.fromMilliseconds(-1).totalMilliseconds).to.be.equal(-1);
        expect(TimeSpan.fromMilliseconds(-1637.1).totalMilliseconds).to.be.equal(-1637);
        expect(TimeSpan.fromMilliseconds(-1637.89).totalMilliseconds).to.be.equal(-1638);
        expect(TimeSpan.fromMilliseconds(23459.12).totalMilliseconds).to.be.equal(23459);
        expect(TimeSpan.fromMilliseconds(23459.86).totalMilliseconds).to.be.equal(23460);
    });
    it("from Date difference.", function () {
        var d1 = new Date(2015, 1, 1, 11, 23, 56, 44), d2 = new Date(2015, 1, 1, 11, 23, 55, 23);
        expect(TimeSpan.fromDateDiff(d1, d2).totalMilliseconds).to.be.equal(1021);
        expect(TimeSpan.fromDateDiff(d2, d1).totalMilliseconds).to.be.equal(-1021);
        expect(TimeSpan.fromDateDiff(d2, d2).totalMilliseconds).to.be.equal(0);
    });
});
describe("Check TimeSpan parts get/set:", function () {
    it("milliseconds", function () {
        var ts;
        expect(new TimeSpan(1234).milliseconds).to.be.equal(234);
        expect(new TimeSpan(-1234).milliseconds).to.be.equal(234);
        expect(new TimeSpan(1234.23).milliseconds).to.be.equal(234);
        expect(new TimeSpan(1234.51).milliseconds).to.be.equal(235);
        expect(new TimeSpan(-5235.23).milliseconds).to.be.equal(235);
        expect(new TimeSpan(-5235.51).milliseconds).to.be.equal(236);
        ts = new TimeSpan("00:10.123");
        ts.milliseconds = 10;
        expect(ts.totalMilliseconds).to.be.equal(10 * second + 10);
        ts = new TimeSpan("00:10.123");
        ts.milliseconds = 987;
        expect(ts.totalMilliseconds).to.be.equal(10 * second + 987);
        ts = new TimeSpan("-00:10.123");
        ts.milliseconds = 10;
        expect(ts.totalMilliseconds).to.be.equal(-(10 * second + 10));
        ts = new TimeSpan("-00:10.123");
        ts.milliseconds = 987;
        expect(ts.totalMilliseconds).to.be.equal(-(10 * second + 987));
        expect(function () { return ts.milliseconds = -1; }).to.throw(Error);
        expect(function () { return ts.milliseconds = 1000; }).to.throw(Error);
        expect(function () { return ts.milliseconds = 33.01; }).to.throw(Error);
    });
    it("seconds", function () {
        var ts;
        expect(new TimeSpan(1234).seconds).to.be.equal(1);
        expect(new TimeSpan(-1234).seconds).to.be.equal(1);
        expect(new TimeSpan(1234.34).seconds).to.be.equal(1);
        expect(new TimeSpan(-1234.34).seconds).to.be.equal(1);
        ts = new TimeSpan("00:6.123");
        ts.seconds = 10;
        expect(ts.totalMilliseconds).to.be.equal(10 * second + 123);
        ts = new TimeSpan("00:6.123");
        ts.seconds = 5;
        expect(ts.totalMilliseconds).to.be.equal(5 * second + 123);
        ts = new TimeSpan("-00:6.123");
        ts.seconds = 10;
        expect(ts.totalMilliseconds).to.be.equal(-(10 * second + 123));
        ts = new TimeSpan("-00:6.123");
        ts.seconds = 5;
        expect(ts.totalMilliseconds).to.be.equal(-(5 * second + 123));
        expect(function () { return ts.seconds = -1; }).to.throw(Error);
        expect(function () { return ts.seconds = 60; }).to.throw(Error);
        expect(function () { return ts.seconds = 1.23; }).to.throw(Error);
    });
    it("minutes", function () {
        var ts;
        expect(new TimeSpan(61234).minutes).to.be.equal(1);
        expect(new TimeSpan(-61234).minutes).to.be.equal(1);
        expect(new TimeSpan(61234.34).minutes).to.be.equal(1);
        expect(new TimeSpan(-61234.34).minutes).to.be.equal(1);
        ts = new TimeSpan("6:6.123");
        ts.minutes = 10;
        expect(ts.totalMilliseconds).to.be.equal(10 * minute + 6 * second + 123);
        ts = new TimeSpan("6:6.123");
        ts.minutes = 5;
        expect(ts.totalMilliseconds).to.be.equal(5 * minute + 6 * second + 123);
        ts = new TimeSpan("-6:6.123");
        ts.minutes = 10;
        expect(ts.totalMilliseconds).to.be.equal(-(10 * minute + 6 * second + 123));
        ts = new TimeSpan("-6:6.123");
        ts.minutes = 5;
        expect(ts.totalMilliseconds).to.be.equal(-(5 * minute + 6 * second + 123));
        expect(function () { return ts.minutes = -1; }).to.throw(Error);
        expect(function () { return ts.minutes = 60; }).to.throw(Error);
        expect(function () { return ts.minutes = 1.23; }).to.throw(Error);
    });
    it("hours", function () {
        var ts;
        expect(new TimeSpan(3600123).hours).to.be.equal(1);
        expect(new TimeSpan(-3600123).hours).to.be.equal(1);
        expect(new TimeSpan(3600123.34).hours).to.be.equal(1);
        expect(new TimeSpan(-3600123.34).hours).to.be.equal(1);
        ts = new TimeSpan("6:10:10.123");
        ts.hours = 10;
        expect(ts.totalMilliseconds).to.be.equal(10 * hour + 10 * minute + 10 * second + 123);
        ts = new TimeSpan("6:10:10.123");
        ts.hours = 5;
        expect(ts.totalMilliseconds).to.be.equal(5 * hour + 10 * minute + 10 * second + 123);
        ts = new TimeSpan("-6:10:10.123");
        ts.hours = 10;
        expect(ts.totalMilliseconds).to.be.equal(-(10 * hour + 10 * minute + 10 * second + 123));
        ts = new TimeSpan("-6:10:10.123");
        ts.hours = 5;
        expect(ts.totalMilliseconds).to.be.equal(-(5 * hour + 10 * minute + 10 * second + 123));
        expect(function () { return ts.hours = -1; }).to.throw(Error);
        expect(function () { return ts.hours = 24; }).to.throw(Error);
        expect(function () { return ts.hours = 1.34; }).to.throw(Error);
    });
    it("days", function () {
        var ts;
        expect(new TimeSpan(87403000).days).to.be.equal(1);
        expect(new TimeSpan(-87403000).days).to.be.equal(1);
        expect(new TimeSpan(87403000.34).days).to.be.equal(1);
        expect(new TimeSpan(-87403000.34).days).to.be.equal(1);
        ts = new TimeSpan("6:10:10.123");
        ts.days = 10;
        expect(ts.totalMilliseconds).to.be.equal(10 * day + 6 * hour + 10 * minute + 10 * second + 123);
        ts = new TimeSpan("6:10:10.123");
        ts.days = 5;
        expect(ts.totalMilliseconds).to.be.equal(5 * day + 6 * hour + 10 * minute + 10 * second + 123);
        ts = new TimeSpan("-6:10:10.123");
        ts.days = 10;
        expect(ts.totalMilliseconds).to.be.equal(-(10 * day + 6 * hour + 10 * minute + 10 * second + 123));
        ts = new TimeSpan("-6:10:10.123");
        ts.days = 5;
        expect(ts.totalMilliseconds).to.be.equal(-(5 * day + 6 * hour + 10 * minute + 10 * second + 123));
        expect(function () { return ts.days = -1; }).to.throw(Error);
        expect(function () { return ts.hours = 1.34; }).to.throw(Error);
    });
});
describe("tryParse specification", function () {
    it("without parameters.", function () {
        expect(TimeSpan.tryParse(undefined).totalMilliseconds).to.be.equal(0);
        expect(TimeSpan.tryParse(null).totalMilliseconds).to.be.equal(0);
    });
    it("with timespan parameter should return new instance.", function () {
        var ts = TimeSpan.fromDays(1);
        expect(TimeSpan.tryParse(ts)).not.equal(ts);
        expect(TimeSpan.tryParse(ts).totalMilliseconds).equal(ts.totalMilliseconds);
    });
    it("with number value.", function () {
        expect(TimeSpan.tryParse(121).totalMilliseconds).to.be.equal(121);
        expect(TimeSpan.tryParse(-121).totalMilliseconds).to.be.equal(-121);
        expect(TimeSpan.tryParse(-12.456).totalMilliseconds).to.be.equal(-12);
        expect(TimeSpan.tryParse(12.456).totalMilliseconds).to.be.equal(12);
        expect(TimeSpan.tryParse(-12.956).totalMilliseconds).to.be.equal(-13);
        expect(TimeSpan.tryParse(12.756).totalMilliseconds).to.be.equal(13);
    });
    it("with valid total milliseconds as string value.", function () {
        expect(TimeSpan.tryParse("0").totalMilliseconds).to.be.equal(0);
        expect(TimeSpan.tryParse("0011").totalMilliseconds).to.be.equal(11);
        expect(TimeSpan.tryParse("121").totalMilliseconds).to.be.equal(121);
        expect(TimeSpan.tryParse("-121").totalMilliseconds).to.be.equal(-121);
        expect(TimeSpan.tryParse("+121").totalMilliseconds).to.be.equal(121);
    });
    it("with invalid total milliseconds as string value.", function () {
        expect(TimeSpan.tryParse("1.121")).to.be.null;
        expect(TimeSpan.tryParse("1a121")).to.be.null;
        expect(TimeSpan.tryParse(" 121")).to.be.null;
        expect(TimeSpan.tryParse("121 ")).to.be.null;
        expect(TimeSpan.tryParse("- 121")).to.be.null;
        expect(TimeSpan.tryParse("-+121")).to.be.null;
    });
    it("with valid string value for pattern [+-][days.]hh:mm:ss[.milliseconds].", function () {
        expect(TimeSpan.tryParse("34:56").totalMilliseconds).to.be.equal(TimeSpan.from(0, 0, 34, 56, 0, false).totalMilliseconds);
        expect(TimeSpan.tryParse("34:56.456").totalMilliseconds).to.be.equal(TimeSpan.from(0, 0, 34, 56, 456, false).totalMilliseconds);
        expect(TimeSpan.tryParse("1:34:56").totalMilliseconds).to.be.equal(TimeSpan.from(0, 1, 34, 56, 0, false).totalMilliseconds);
        expect(TimeSpan.tryParse("1.2:3:4.5").totalMilliseconds).to.be.equal(TimeSpan.from(1, 2, 3, 4, 5, false).totalMilliseconds);
        expect(TimeSpan.tryParse("01.02:03:04.005").totalMilliseconds).to.be.equal(TimeSpan.from(1, 2, 3, 4, 5, false).totalMilliseconds);
        expect(TimeSpan.tryParse("02:03:04.005").totalMilliseconds).to.be.equal(TimeSpan.from(0, 2, 3, 4, 5, false).totalMilliseconds);
        expect(TimeSpan.tryParse("+01.22:56:59.999").totalMilliseconds).to.be.equal(TimeSpan.from(1, 22, 56, 59, 999, false).totalMilliseconds);
        expect(TimeSpan.tryParse("-01.22:56:59.999").totalMilliseconds).to.be.equal(TimeSpan.from(1, 22, 56, 59, 999, true).totalMilliseconds);
    });
    it("with invalid string value for pattern [+-][days.]hh:mm:ss[.milliseconds].", function () {
        expect(TimeSpan.tryParse("00:60")).to.be.null;
        expect(TimeSpan.tryParse("60:00")).to.be.null;
        expect(TimeSpan.tryParse("25:00:00")).to.be.null;
        expect(TimeSpan.tryParse("30:00:00")).to.be.null;
        expect(TimeSpan.tryParse("00:00:00.1000")).to.be.null;
    });
});
describe("TimeSpan operations", function () {
    it("like addition, substraction etc...", function () {
        expect(TimeSpan.fromMilliseconds(1567).negate().totalMilliseconds).to.be.equal(-1567);
        expect(TimeSpan.fromMilliseconds(1567).add(TimeSpan.fromMilliseconds(-1567)).totalMilliseconds).to.be.equal(0);
        expect(TimeSpan.fromMilliseconds(1567).substract(TimeSpan.fromMilliseconds(-1567)).totalMilliseconds).to.be.equal(3134);
        expect(TimeSpan.fromMilliseconds(1567).addMilliseconds(2.1).totalMilliseconds).to.be.equal(1569);
        ;
        expect(TimeSpan.fromMilliseconds(1567).addMilliseconds(-2.9).totalMilliseconds).to.be.equal(1564);
        ;
        expect(TimeSpan.fromMilliseconds(1567).addSeconds(2.1).totalMilliseconds).to.be.equal(3667);
        ;
        expect(TimeSpan.fromMilliseconds(1567).addSeconds(-2.1).totalMilliseconds).to.be.equal(-533);
        ;
        expect(TimeSpan.fromMilliseconds(1567).addMinutes(2.1).totalMilliseconds).to.be.equal(127567);
        ;
        expect(TimeSpan.fromMilliseconds(1567).addHours(2.1).totalMilliseconds).to.be.equal(7561567);
        ;
        expect(TimeSpan.fromMilliseconds(1567).addDays(-2.1).totalMilliseconds).to.be.equal(-181438433);
        ;
    });
});
describe("TimeSpan comparison", function () {
    it("like compare, equal, less etc...", function () {
        expect(TimeSpan.compare(TimeSpan.fromMilliseconds(0), TimeSpan.fromMilliseconds(0))).to.be.equal(0);
        expect(TimeSpan.compare(TimeSpan.fromMilliseconds(-4), TimeSpan.fromMilliseconds(-2))).to.be.equal(-1);
        expect(TimeSpan.compare(TimeSpan.fromMilliseconds(4), TimeSpan.fromMilliseconds(2))).to.be.equal(1);
        expect(TimeSpan.equal(TimeSpan.fromMilliseconds(-42), TimeSpan.fromMilliseconds(-42))).to.be.true;
        expect(TimeSpan.equal(TimeSpan.fromMilliseconds(-42), TimeSpan.fromMilliseconds(42))).to.be.false;
        expect(TimeSpan.more(TimeSpan.fromMilliseconds(-42), TimeSpan.fromMilliseconds(-42))).to.be.false;
        expect(TimeSpan.more(TimeSpan.fromMilliseconds(-41), TimeSpan.fromMilliseconds(-42))).to.be.true;
        expect(TimeSpan.moreOrEqual(TimeSpan.fromMilliseconds(42), TimeSpan.fromMilliseconds(42))).to.be.true;
        expect(TimeSpan.moreOrEqual(TimeSpan.fromMilliseconds(-41), TimeSpan.fromMilliseconds(-42))).to.be.true;
        expect(TimeSpan.moreOrEqual(TimeSpan.fromMilliseconds(-43.1), TimeSpan.fromMilliseconds(-42))).to.be.false;
        expect(TimeSpan.less(TimeSpan.fromMilliseconds(-42), TimeSpan.fromMilliseconds(-42))).to.be.false;
        expect(TimeSpan.less(TimeSpan.fromMilliseconds(-43), TimeSpan.fromMilliseconds(-42))).to.be.true;
        expect(TimeSpan.lessOrEqual(TimeSpan.fromMilliseconds(42), TimeSpan.fromMilliseconds(42))).to.be.true;
        expect(TimeSpan.lessOrEqual(TimeSpan.fromMilliseconds(-45), TimeSpan.fromMilliseconds(-42))).to.be.true;
        expect(TimeSpan.lessOrEqual(TimeSpan.fromMilliseconds(-43.1), TimeSpan.fromMilliseconds(-43))).to.be.true;
    });
    it("like isZero, isPositive and isNegative.", function () {
        expect(TimeSpan.fromMilliseconds(0).isZero).to.be.true;
        expect(TimeSpan.fromMilliseconds(1).isZero).not.to.be.true;
        expect(TimeSpan.fromMilliseconds(0).isPositive).not.to.be.true;
        expect(TimeSpan.fromMilliseconds(1).isPositive).to.be.true;
        expect(TimeSpan.fromMilliseconds(-1).isPositive).not.to.be.true;
        expect(TimeSpan.fromMilliseconds(0).isNegative).not.to.be.true;
        expect(TimeSpan.fromMilliseconds(1).isNegative).not.to.be.true;
        expect(TimeSpan.fromMilliseconds(-1).isNegative).to.be.true;
    });
});
describe("TimeSpan formatting", function () {
    it("with default  pattern.", function () {
        expect(TimeSpan.from(1, 2, 3, 4, 5, false).toString()).to.be.equal("1.02:03:04.005");
        expect(TimeSpan.from(11, 22, 33, 44, 123, false).toString()).to.be.equal("11.22:33:44.123");
        expect(TimeSpan.from(1, 1, 1, 1, 11, true).toString()).to.be.equal("-1.01:01:01.011");
        expect(TimeSpan.from(12, 12, 12, 12, 123, true).toString()).to.be.equal("-12.12:12:12.123");
    });
    it("with manadatory '+' sign.", function () {
        expect(TimeSpan.from(1, 1, 1, 1, 1, false).toString("%+%d.%hh:%mm:%ss.%t")).to.be.equal("+1.01:01:01.1");
        expect(TimeSpan.from(12, 12, 12, 12, 123, false).toString("%+%d.%hh:%mm:%ss.%t")).to.be.equal("+12.12:12:12.123");
        expect(TimeSpan.from(12, 12, 12, 12, 123, true).toString("%+%d.%hh:%mm:%ss.%t")).to.be.equal("-12.12:12:12.123");
    });
    it("with custom pattern.", function () {
        expect(TimeSpan.from(1, 2, 3, 4, 5, false).toString("%%")).to.be.equal("%");
        expect(TimeSpan.from(1, 2, 3, 4, 5, false).toString("%%%%")).to.be.equal("%%");
        expect(TimeSpan.from(1, 2, 3, 4, 5, false).toString("%+%d.%h:%m:%s.%t")).to.be.equal("+1.2:3:4.5");
        expect(TimeSpan.from(1, 2, 3, 4, 789, false).toString("%t")).to.be.equal("789");
        expect(TimeSpan.from(1, 2, 3, 4, 789, false).toString("%tt")).to.be.equal("789");
        expect(TimeSpan.from(1, 2, 3, 4, 9, false).toString("%tt")).to.be.equal("009");
        expect(TimeSpan.from(1, 2, 3, 4, 9, false).toString("%d%hh%mm%ss%tt")).to.be.equal("1020304009");
    });
    it("invalide pattern.", function () {
        expect(function () { return TimeSpan.from(1, 1, 1, 1, 1, false).toString("%"); }).to.throw(Error);
        expect(function () { return TimeSpan.from(1, 1, 1, 1, 1, false).toString("%t%"); }).to.throw(Error);
        expect(function () { return TimeSpan.from(1, 1, 1, 1, 1, false).toString("%%%"); }).to.throw(Error);
    });
});
//# sourceMappingURL=time-span-test.js.map