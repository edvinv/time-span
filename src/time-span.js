var millisecond = 1, second = 1000 * millisecond, minute = 60 * second, hour = 60 * minute, day = 24 * hour, week = 7 * day;
var TimeSpan = (function () {
    function TimeSpan(value) {
        this._ms = 0;
        if (value !== undefined) {
            this.set(value);
        }
    }
    //#region properties
    TimeSpan.prototype.set = function (value) {
        var d = TimeSpan.parse(value);
        this._ms = d.totalMilliseconds;
    };
    Object.defineProperty(TimeSpan.prototype, "milliseconds", {
        get: function () {
            return Math.floor(Math.abs(this._ms) % 1000);
        },
        set: function (value) {
            if (value < 0 || value >= 1000) {
                throw new Error("TimeSpan: Invalide parameter for set milliseconds.");
            }
            this._ms = this._ms + (value - this.milliseconds);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TimeSpan.prototype, "seconds", {
        get: function () {
            return Math.floor((Math.abs(this._ms) / second) % 60);
        },
        set: function (value) {
            if (value < 0 || value >= 60) {
                throw new Error("TimeSpan: Invalide parameter for set seconds.");
            }
            this._ms = this._ms - second * (value - this.seconds);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TimeSpan.prototype, "minutes", {
        get: function () {
            return Math.floor((Math.abs(this._ms) / minute) % 60);
        },
        set: function (value) {
            if (value < 0 || value >= 60) {
                throw new Error("TimeSpan: Invalide parameter for set minutes.");
            }
            this._ms = this._ms - minute * (value - this.minutes);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TimeSpan.prototype, "hours", {
        get: function () {
            return Math.floor((Math.abs(this._ms) / hour) % 24);
        },
        set: function (value) {
            if (value < 0 || value >= 24) {
                throw new Error("TimeSpan: Invalide parameter for set hours.");
            }
            this._ms = this._ms - minute * (value - this.hours);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TimeSpan.prototype, "days", {
        get: function () {
            return Math.floor((Math.abs(this._ms) / day));
        },
        set: function (value) {
            if (value < 0) {
                throw new Error("TimeSpan: Invalide parameter for set days.");
            }
            this._ms = this._ms - minute * (value - this.days);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TimeSpan.prototype, "totalMilliseconds", {
        get: function () {
            return this._ms;
        },
        set: function (value) {
            this._ms = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TimeSpan.prototype, "totalSeconds", {
        get: function () {
            return (this._ms / second);
        },
        set: function (value) {
            this._ms = value * second;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TimeSpan.prototype, "totalMinutes", {
        get: function () {
            return (this._ms / minute);
        },
        set: function (value) {
            this._ms = value * minute;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TimeSpan.prototype, "totalHours", {
        get: function () {
            return (this._ms / hour);
        },
        set: function (value) {
            this._ms = value * hour;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TimeSpan.prototype, "totalDays", {
        get: function () {
            return (this._ms / day);
        },
        set: function (value) {
            this._ms = value * day;
        },
        enumerable: true,
        configurable: true
    });
    //#endregion
    //#region from methods
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
        return new TimeSpan(-this._ms);
    };
    TimeSpan.prototype.add = function (duration) {
        return new TimeSpan(this._ms + duration._ms);
    };
    TimeSpan.prototype.addMilliseconds = function (ms) {
        return new TimeSpan(this._ms + ms);
    };
    TimeSpan.prototype.addSeconds = function (seconds) {
        return new TimeSpan(this._ms + seconds * second);
    };
    TimeSpan.prototype.addMinutes = function (minutes) {
        return new TimeSpan(this._ms + minutes * minute);
    };
    TimeSpan.prototype.addHours = function (hours) {
        return new TimeSpan(this._ms + hours * hour);
    };
    TimeSpan.prototype.addDays = function (days) {
        return new TimeSpan(this._ms + days * day);
    };
    TimeSpan.prototype.substract = function (duration) {
        return this.add(duration.negate());
    };
    //#endregion
    //#region parse
    TimeSpan.parse = function (value) {
        var duration = TimeSpan.tryParse(value);
        if (!duration) {
            throw Error("Invalide duration value: '" + value + "'. Valid format is '[+-][days.]hh:mm:ss[.milliseconds]'.");
        }
        return duration;
    };
    /**
    * value is in following format:
    * 	 - if value is undefined or null, return zero duration
    * 	 - if value is instance of Duration, return value
    * 	 - if value is number, value is treated as milliseconds
    * 	 - if value is string representation of number (float) then is treated as milliseconds
    *
    *	otherwise following pattern is used:
    *		[+-][days.]hh:mm:ss[.milliseconds]
    * - null is returned in the case of error
    */
    TimeSpan.tryParse = function (value) {
        // if value is undefined or null return zero duration
        if (value == null) {
            return TimeSpan.fromMilliseconds(0);
        }
        // if value is already duration return same duration instance
        if (value instanceof TimeSpan) {
            return value;
        }
        // if value is number then this are miliseconds
        if (typeof value === "number") {
            return TimeSpan.fromMilliseconds(value);
        }
        if (typeof value === "string") {
            // if value is string and is float number then this are miliseconds
            var parsedValue = parseFloat(value);
            if (!isNaN(parsedValue) && parsedValue == value) {
                return TimeSpan.fromMilliseconds(parseFloat(value));
            }
            // otherwise use following pattern [+-][days.]hh:mm:ss[.milliseconds]
            var durationRegex = /^([\-\+])?((\d+)(\.))?([01]?\d|2[0123]):([012345]?\d):([012345]?\d)((\.)(\d+))?$/g;
            var res = durationRegex.exec(value);
            if (!res) {
                return null;
            }
            return TimeSpan.from(res[3] !== undefined ? parseInt(res[3], 10) : 0, parseInt(res[5], 10), parseInt(res[6], 10), parseInt(res[7], 10), res[10] !== undefined ? parseInt(res[10], 10) : 0, res[1] === '-');
        }
        return null;
    };
    //#endregion
    //#region format
    /**
         * format string specification:
         * HH hours with leading 0
         * hh hours without leading 0
         * MM hours with leading 0
         * mm hours without leading 0
         * SS hours with leading 0
         * ss hours without leading 0
         *
         */
    TimeSpan.prototype.toString = function (format) {
        if (format === void 0) { format = "HH:MM:SS"; }
        function replace(text, formatItem, value, leadingZeroCount) {
            if (text.indexOf(formatItem) >= 0) {
                var replaceWith = value.toString();
                if (leadingZeroCount !== undefined) {
                    while (replaceWith.length < leadingZeroCount) {
                        replaceWith = "0" + replaceWith;
                    }
                }
                text = text.replace(formatItem, replaceWith);
            }
            return text;
        }
        var s = this.seconds, m = this.minutes, h = this.hours;
        var text = replace(format, "HH", h, 2);
        text = replace(text, "hh", h);
        text = replace(text, "MM", m, 2);
        text = replace(text, "mm", m);
        text = replace(text, "SS", s, 2);
        text = replace(text, "ss", s);
        return text;
    };
    //#endregion
    //#region comparison
    TimeSpan.compare = function (d1, d2) {
        return d1._ms === d2._ms ? 0 : (d1._ms < d2._ms ? -1 : 1);
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
            return this._ms === 0;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TimeSpan.prototype, "isPositive", {
        get: function () {
            return this._ms > 0;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TimeSpan.prototype, "isNegative", {
        get: function () {
            return this._ms < 0;
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
    return TimeSpan;
})();
module.exports = TimeSpan;
//# sourceMappingURL=time-span.js.map