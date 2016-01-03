var millisecond = 1, second = 1000 * millisecond, minute = 60 * second, hour = 60 * minute, day = 24 * hour, week = 7 * day;
var TimeSpan = (function () {
    function TimeSpan(value) {
        this._ms = 0;
        if (value !== undefined) {
            this.set.apply(this, arguments);
        }
    }
    //#region formating
    TimeSpan.registerFormat = function (name, format) {
        TimeSpan.formats[name] = format;
    };
    TimeSpan.unregisterFormat = function (name) {
        delete TimeSpan.formats[name];
    };
    TimeSpan.getFormat = function (format) {
        if (typeof format === 'string') {
            format = TimeSpan.formats[format];
            throw new Error("TimeSpan: Format name '" + format + "' is not valid.");
        }
        return format;
    };
    TimeSpan.prototype.set = function (value) {
        var ms = tryParseToMs(value);
        if (ms === null) {
            throw Error("Invalide duration value: '" + value + "'. Valid format is '[+-][days.]hh:mm:ss[.milliseconds]'.");
        }
        this.totalMilliseconds = ms;
        return this;
    };
    Object.defineProperty(TimeSpan.prototype, "milliseconds", {
        get: function () {
            return Math.abs(this.totalMilliseconds) % 1000;
        },
        set: function (value) {
            if (value < 0 || value >= 1000 || Math.round(value) !== value) {
                throw new Error("TimeSpan: Invalide parameter for set milliseconds.");
            }
            this.totalMilliseconds += (value - this.milliseconds) * (this.isNegative ? -1 : 1);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TimeSpan.prototype, "seconds", {
        get: function () {
            return Math.floor((Math.abs(this.totalMilliseconds) / second) % 60);
        },
        set: function (value) {
            if (value < 0 || value >= 60 || Math.round(value) !== value) {
                throw new Error("TimeSpan: Invalide parameter for set seconds.");
            }
            this.totalMilliseconds += second * (value - this.seconds) * (this.isNegative ? -1 : 1);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TimeSpan.prototype, "minutes", {
        get: function () {
            return Math.floor((Math.abs(this.totalMilliseconds) / minute) % 60);
        },
        set: function (value) {
            if (value < 0 || value >= 60 || Math.round(value) !== value) {
                throw new Error("TimeSpan: Invalide parameter for set minutes.");
            }
            this.totalMilliseconds += minute * (value - this.minutes) * (this.isNegative ? -1 : 1);
            ;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TimeSpan.prototype, "hours", {
        get: function () {
            return Math.floor((Math.abs(this.totalMilliseconds) / hour) % 24);
        },
        set: function (value) {
            if (value < 0 || value >= 24 || Math.round(value) !== value) {
                throw new Error("TimeSpan: Invalide parameter for set hours.");
            }
            this.totalMilliseconds += hour * (value - this.hours) * (this.isNegative ? -1 : 1);
            ;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TimeSpan.prototype, "days", {
        get: function () {
            return Math.floor((Math.abs(this.totalMilliseconds) / day));
        },
        set: function (value) {
            if (value < 0 || Math.round(value) !== value) {
                throw new Error("TimeSpan: Invalide parameter for set days.");
            }
            this.totalMilliseconds += day * (value - this.days) * (this.isNegative ? -1 : 1);
            ;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TimeSpan.prototype, "totalMilliseconds", {
        get: function () {
            return this._ms;
        },
        set: function (value) {
            this._ms = Math.round(value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TimeSpan.prototype, "totalSeconds", {
        get: function () {
            return (this.totalMilliseconds / second);
        },
        set: function (value) {
            this.totalMilliseconds = value * second;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TimeSpan.prototype, "totalMinutes", {
        get: function () {
            return (this.totalMilliseconds / minute);
        },
        set: function (value) {
            this.totalMilliseconds = value * minute;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TimeSpan.prototype, "totalHours", {
        get: function () {
            return (this.totalMilliseconds / hour);
        },
        set: function (value) {
            this.totalMilliseconds = value * hour;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TimeSpan.prototype, "totalDays", {
        get: function () {
            return (this.totalMilliseconds / day);
        },
        set: function (value) {
            this.totalMilliseconds = value * day;
        },
        enumerable: true,
        configurable: true
    });
    //#endregion
    //#region TimeSpan instantiation methods
    /**
    * Returns duration for d1-d2
    */
    TimeSpan.from = function (days, hours, minutes, seconds, ms, negative) {
        if (days === void 0) { days = 0; }
        if (hours === void 0) { hours = 0; }
        if (minutes === void 0) { minutes = 0; }
        if (seconds === void 0) { seconds = 0; }
        if (ms === void 0) { ms = 0; }
        if (negative === void 0) { negative = false; }
        return new TimeSpan((days * day + hours * hour + minutes * minute + seconds * second + ms * millisecond) * (negative ? -1 : 1));
    };
    TimeSpan.fromDateDiff = function (d1, d2) {
        return TimeSpan.fromMilliseconds(d1.getTime() - d2.getTime());
    };
    TimeSpan.fromMilliseconds = function (ms) {
        var ts = new TimeSpan();
        ts.totalMilliseconds = ms;
        return ts;
    };
    TimeSpan.fromSeconds = function (secs) {
        return new TimeSpan(secs * second);
    };
    TimeSpan.fromMinutes = function (minutes) {
        return new TimeSpan(minutes * minute);
    };
    TimeSpan.fromHours = function (hours) {
        return new TimeSpan(hours * hour);
    };
    TimeSpan.fromDays = function (days) {
        return new TimeSpan(days * day);
    };
    //#endregion
    //#region operations
    TimeSpan.prototype.negate = function () {
        return new TimeSpan(-this.totalMilliseconds);
    };
    TimeSpan.prototype.add = function (duration) {
        return new TimeSpan(this.totalMilliseconds + duration.totalMilliseconds);
    };
    TimeSpan.prototype.addMilliseconds = function (ms) {
        return new TimeSpan(this.totalMilliseconds + ms);
    };
    TimeSpan.prototype.addSeconds = function (seconds) {
        return new TimeSpan(this.totalMilliseconds + seconds * second);
    };
    TimeSpan.prototype.addMinutes = function (minutes) {
        return new TimeSpan(this.totalMilliseconds + minutes * minute);
    };
    TimeSpan.prototype.addHours = function (hours) {
        return new TimeSpan(this.totalMilliseconds + hours * hour);
    };
    TimeSpan.prototype.addDays = function (days) {
        return new TimeSpan(this.totalMilliseconds + days * day);
    };
    TimeSpan.prototype.substract = function (duration) {
        return this.add(duration.negate());
    };
    TimeSpan.parse = function (value, p1, p2, p3, p4) {
        var ts = TimeSpan.tryParse(value);
        if (!ts) {
            throw Error("Invalide duration value: '" + value + "'. Valid format is '[+-][days.]hh:mm:ss[.milliseconds]'.");
        }
        return ts;
    };
    TimeSpan.tryParse = function (value, p1, p2, p3, p4) {
        var ms = tryParseToMs(value);
        return ms === null ? null : new TimeSpan(ms);
    };
    //#endregion
    //#region formating
    // "%-%d.%hh:%mm:%ss.%tt"
    TimeSpan.prototype.toString = function (f) {
        return format(this, f);
    };
    //#endregion
    //#region comparison
    TimeSpan.compare = function (d1, d2) {
        return d1.totalMilliseconds === d2.totalMilliseconds ? 0 : (d1.totalMilliseconds < d2.totalMilliseconds ? -1 : 1);
    };
    TimeSpan.equal = function (d1, d2) {
        return TimeSpan.compare(d1, d2) === 0;
    };
    TimeSpan.less = function (d1, d2) {
        return TimeSpan.compare(d1, d2) < 0;
    };
    TimeSpan.lessOrEqual = function (d1, d2) {
        return TimeSpan.compare(d1, d2) <= 0;
    };
    TimeSpan.more = function (d1, d2) {
        return TimeSpan.compare(d1, d2) > 0;
    };
    TimeSpan.moreOrEqual = function (d1, d2) {
        return TimeSpan.compare(d1, d2) >= 0;
    };
    Object.defineProperty(TimeSpan.prototype, "isZero", {
        get: function () {
            return this.totalMilliseconds === 0;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TimeSpan.prototype, "isPositive", {
        get: function () {
            return this.totalMilliseconds > 0;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TimeSpan.prototype, "isNegative", {
        get: function () {
            return this.totalMilliseconds < 0;
        },
        enumerable: true,
        configurable: true
    });
    TimeSpan.prototype.compare = function (d) {
        return TimeSpan.compare(this, d);
    };
    TimeSpan.prototype.equalTo = function (d) {
        return TimeSpan.equal(this, d);
    };
    TimeSpan.prototype.lessThen = function (d) {
        return TimeSpan.less(this, d);
    };
    TimeSpan.prototype.lessOrEqualThen = function (d) {
        return TimeSpan.lessOrEqual(this, d);
    };
    TimeSpan.prototype.moreThen = function (d) {
        return TimeSpan.more(this, d);
    };
    TimeSpan.prototype.moreOrEqualThen = function (d) {
        return TimeSpan.moreOrEqual(this, d);
    };
    TimeSpan.zero = new TimeSpan(0);
    TimeSpan.formats = {};
    return TimeSpan;
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = TimeSpan;
function tryParseToMs(value, p1, p2, p3, p4) {
    // if value is undefined or null return zero duration
    if (value == null) {
        return 0;
    }
    if (typeof (value) === 'string') {
        return tryParseText(value, p1);
    }
    // if value is already TimeSpan instance return totalMilliseconds of that value
    if (value instanceof TimeSpan) {
        return value.totalMilliseconds;
    }
    if (typeof (value) === 'number' && typeof (p1) === 'number' && typeof (p2) === 'number') {
        if (p3 === undefined) {
            return value * hour + p1 * minute + p2 * second;
        }
        else if (typeof (p2) === 'number') {
            if (p4 === undefined) {
                return value * day + p1 * hour + p2 * minute + p3 * second;
            }
            else if (typeof (p3) === 'number') {
                return value * day + p1 * hour + p2 * minute + p3 * second + p4;
            }
        }
    }
    throw new TypeError("Invalide arguments for parse method");
}
function tryParseText(value, format) {
    var durationRegex = /^((([\-\+])?((\d+)(\.))?(([01]?\d|2[0123]):)?([012345]?\d):([012345]?\d)((\.)(\d{1,3}))?)|([+-]?\d+))$/g;
    var res = durationRegex.exec(value);
    if (!res) {
        return null;
    }
    if (res[14]) {
        // string represent total milliseconds
        return parseInt(res[14], 10);
    }
    return ((res[5] !== undefined ? day * parseInt(res[5], 10) : 0) +
        (res[8] !== undefined ? hour * parseInt(res[8], 10) : 0) +
        minute * parseInt(res[9], 10) +
        second * parseInt(res[10], 10) +
        (res[13] !== undefined ? parseInt(res[13], 10) : 0)) * (res[3] === '-' ? -1 : 1);
}
function leadingZeros(n, count) {
    var r = n.toString();
    while (r.length < count) {
        r = "0" + r;
    }
    return r;
}
var formatters = {
    '%': function () { return '%'; },
    '-': function () { return this.isNegative ? "-" : ""; },
    '+': function () { return this.isNegative ? "-" : "+"; },
    'd': function () { return this.days.toString(); },
    'h': function () { return this.hours.toString(); },
    'hh': function () { return leadingZeros(this.hours, 2); },
    'm': function () { return this.minutes.toString(); },
    'mm': function () { return leadingZeros(this.minutes, 2); },
    's': function () { return this.seconds.toString(); },
    'ss': function () { return leadingZeros(this.seconds, 2); },
    't': function () { return this.milliseconds.toString(); },
    'tt': function () { return leadingZeros(this.milliseconds, 3); }
};
var maxFormatterCmdLength = Object.keys(formatters).reduce(function (p, c) { return c.length > p ? c.length : p; }, 0);
/**
   * format string specification:
   * %- sign ('-' if negative, '' if positive)
   * %+ sign ('-' if negative, '+' if positive)
   * %d days without leading 0
   * %hh hours with leading 0
   * %h hours without leading 0
   * %mm minutes with leading 0
   * %m minutes without leading 0
   * %ss seconds with leading 0
   * %s seconds without leading 0
   * %t miliseconds with leading 0
   * %tt miliseconds without leading 0
   */
function format(ts, format) {
    var res = "", cmd = null, maxCmdLength = maxFormatterCmdLength, i, ic, fl = format.length, curr = null, formatter;
    for (i = 0; i < fl; ++i) {
        if (cmd) {
            for (ic = maxCmdLength; ic > 0; --ic) {
                cmd = format.slice(i, i + ic);
                formatter = formatters[cmd];
                if (formatter) {
                    break;
                }
            }
            if (formatter) {
                i += cmd.length - 1;
                res += formatter.apply(this);
                cmd = false;
            }
            else {
                throw new Error("TimeSpan: Invalide format expression :'" + format + "'.");
            }
        }
        else {
            curr = format[i];
            if (curr === '%') {
                cmd = true;
            }
            else {
                res += curr;
            }
        }
    }
    if (cmd) {
        throw new Error("TimeSpan: Invalide format expression :'" + format + "'.");
    }
    return res;
}
//export =TimeSpan;
//# sourceMappingURL=time-span.js.map