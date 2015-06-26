var cty;
(function (cty) {
    var sys;
    (function (sys) {
        var millisecond = 1, second = 1000 * millisecond, minute = 60 * second, hour = 60 * minute, day = 24 * hour, week = 7 * day;
        var Duration = (function () {
            function Duration(duration) {
                this.roundSeconds = this.adjustSeconds.bind(this, Math.round);
                this.ceilSeconds = this.adjustSeconds.bind(this, Math.ceil);
                this.floorSeconds = this.adjustSeconds.bind(this, Math.floor);
                if (duration instanceof Duration) {
                    duration = duration._ms;
                }
                switch (typeof duration) {
                    case "number":
                        this._ms = duration;
                        break;
                    case "string":
                        this._ms = Duration.parse(duration)._ms;
                        break;
                    case "undefined":
                        this._ms = 0;
                        break;
                    default:
                        this._ms = 0;
                        break;
                }
            }
            Object.defineProperty(Duration.prototype, "milliseconds", {
                //#region properties
                get: function () {
                    return Math.floor(Math.abs(this._ms) % 1000);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Duration.prototype, "seconds", {
                get: function () {
                    return Math.floor((Math.abs(this._ms) / second) % 60);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Duration.prototype, "minutes", {
                get: function () {
                    return Math.floor((Math.abs(this._ms) / minute) % 60);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Duration.prototype, "hours", {
                get: function () {
                    return Math.floor((Math.abs(this._ms) / hour) % 24);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Duration.prototype, "days", {
                get: function () {
                    return Math.floor((Math.abs(this._ms) / day));
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Duration.prototype, "totalMilliseconds", {
                get: function () {
                    return this._ms;
                },
                set: function (value) {
                    this._ms = value;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Duration.prototype, "totalSeconds", {
                get: function () {
                    return (this._ms / second);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Duration.prototype, "totalMinutes", {
                get: function () {
                    return (this._ms / minute);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Duration.prototype, "totalHours", {
                get: function () {
                    return (this._ms / hour);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Duration.prototype, "totalDays", {
                get: function () {
                    return (this._ms / day);
                },
                enumerable: true,
                configurable: true
            });
            //#endregion
            //#region rounding
            Duration.prototype.adjustSeconds = function (adjustFunc) {
                this._ms = 1000 * adjustFunc(this._ms / 1000);
                return this;
            };
            //#endregion
            //#region from methods
            /**
            * Returns duration for d1-d2
            */
            Duration.from = function (days, hours, minutes, seconds, ms, negative) {
                if (days === void 0) { days = 0; }
                if (hours === void 0) { hours = 0; }
                if (minutes === void 0) { minutes = 0; }
                if (seconds === void 0) { seconds = 0; }
                if (ms === void 0) { ms = 0; }
                if (negative === void 0) { negative = false; }
                return new Duration((days * day + hours * hour + minutes * minute + seconds * second + ms * millisecond) * (negative ? -1 : 1));
            };
            Duration.fromDateDiff = function (d1, d2) {
                return Duration.fromMilliseconds(d1.getTime() - d2.getTime());
            };
            Duration.fromMilliseconds = function (ms) {
                return new Duration(ms);
            };
            Duration.fromSeconds = function (secs) {
                return new Duration(secs * second);
            };
            Duration.fromMinutes = function (minutes) {
                return new Duration(minutes * minute);
            };
            Duration.fromHours = function (hours) {
                return new Duration(hours * hour);
            };
            Duration.fromDays = function (days) {
                return new Duration(days * day);
            };
            //#endregion
            //#region Time operation
            Duration.substract = function (t1, t2) {
                return new Duration(t1.getTime() - t2.getTime());
            };
            //#endregion
            //#region operations
            Duration.prototype.negate = function () {
                return new Duration(-this._ms);
            };
            Duration.prototype.add = function (duration) {
                return new Duration(this._ms + duration._ms);
            };
            Duration.prototype.addMilliseconds = function (ms) {
                return new Duration(this._ms + ms);
            };
            Duration.prototype.addSeconds = function (seconds) {
                return new Duration(this._ms + seconds * second);
            };
            Duration.prototype.addMinutes = function (minutes) {
                return new Duration(this._ms + minutes * minute);
            };
            Duration.prototype.addHours = function (hours) {
                return new Duration(this._ms + hours * hour);
            };
            Duration.prototype.addDays = function (days) {
                return new Duration(this._ms + days * day);
            };
            Duration.prototype.substract = function (duration) {
                return this.add(duration.negate());
            };
            Duration.parse = function (value) {
                var duration = Duration.tryParse(value);
                if (!duration) {
                    throw Error("Invalide duration value: '" + value + "'. Valid format is '[+-][days.]hh:mm:ss[.milliseconds]'.");
                }
                return duration;
            };
            Duration.tryParse = function (value) {
                // if value is already duration return duration
                if (value instanceof Duration) {
                    return value;
                }
                // if value is number then this are milisecondsn
                if (typeof value === "number") {
                    return Duration.fromMilliseconds(value);
                }
                // if value is string and is float number then this are miliseconds
                var durationString = value;
                if (/^(\-|\+)?([0-9]+(\.[0-9]+)?)$/.test(durationString)) {
                    return Duration.fromMilliseconds(parseFloat(durationString));
                }
                var durationRegex = /^([\-\+])?((\d+)(\.))?([01]?\d|2[0123]):([012345]?\d):([012345]?\d)((\.)(\d+))?$/g;
                var res = durationRegex.exec(durationString);
                if (!res) {
                    return null;
                }
                return Duration.from(res[3] !== undefined ? parseInt(res[3], 10) : 0, parseInt(res[5], 10), parseInt(res[6], 10), parseInt(res[7], 10), res[10] !== undefined ? parseInt(res[10], 10) : 0, res[1] === '-');
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
            Duration.prototype.toString = function (format) {
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
            Duration.compare = function (d1, d2) {
                return d1._ms === d2._ms ? 0 : (d1._ms < d2._ms ? -1 : 1);
            };
            Duration.equal = function (d1, d2) {
                return Duration.compare(d1, d2) === 0;
            };
            Duration.less = function (d1, d2) {
                return Duration.compare(d1, d2) < 0;
            };
            Duration.lessOrEqual = function (d1, d2) {
                return Duration.compare(d1, d2) <= 0;
            };
            Duration.more = function (d1, d2) {
                return Duration.compare(d1, d2) > 0;
            };
            Duration.moreOrEqual = function (d1, d2) {
                return Duration.compare(d1, d2) >= 0;
            };
            Object.defineProperty(Duration.prototype, "isZero", {
                get: function () {
                    return this._ms === 0;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Duration.prototype, "isPositive", {
                get: function () {
                    return this._ms > 0;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Duration.prototype, "isNegative", {
                get: function () {
                    return this._ms < 0;
                },
                enumerable: true,
                configurable: true
            });
            Duration.prototype.compare = function (d) {
                return Duration.compare(this, d);
            };
            Duration.prototype.equalTo = function (d) {
                return Duration.equal(this, d);
            };
            Duration.prototype.lessThen = function (d) {
                return Duration.less(this, d);
            };
            Duration.prototype.lessOrEqualThen = function (d) {
                return Duration.lessOrEqual(this, d);
            };
            Duration.prototype.moreThen = function (d) {
                return Duration.more(this, d);
            };
            Duration.prototype.moreOrEqualThen = function (d) {
                return Duration.moreOrEqual(this, d);
            };
            Duration.zero = new Duration(0);
            return Duration;
        })();
        sys.Duration = Duration;
    })(sys = cty.sys || (cty.sys = {}));
})(cty || (cty = {}));
//# sourceMappingURL=time-span.js.map