var millisecond = 1,
	second = 1000 * millisecond,
	minute = 60 * second,
	hour = 60 * minute,
	day = 24 * hour,
	week = 7 * day;

class TimeSpan {

	private _ms: number = 0;
	static zero = new TimeSpan(0);

	constructor(value?: number|string|TimeSpan) {
		if (value !== undefined) {
			this.set(value);
		}
	}

	//#region properties
	set(value?: number|string|TimeSpan) {
		var d = TimeSpan.parse(value);
		this._ms = d.totalMilliseconds;
	}

	get milliseconds(): number {
		return Math.floor(Math.abs(this._ms) % 1000);
	}
	set milliseconds(value: number) {
		if (value < 0 || value >= 1000) {
			throw new Error("TimeSpan: Invalide parameter for set milliseconds.");
		}
		this._ms = this._ms + (value - this.milliseconds);
	}

	get seconds(): number {
		return Math.floor((Math.abs(this._ms) / second) % 60);
	}
	set seconds(value: number) {
		if (value < 0 || value >= 60) {
			throw new Error("TimeSpan: Invalide parameter for set seconds.");
		}
		this._ms = this._ms - second * (value - this.seconds);
	}

	get minutes(): number {
		return Math.floor((Math.abs(this._ms) / minute) % 60);
	}
	set minutes(value: number) {
		if (value < 0 || value >= 60) {
			throw new Error("TimeSpan: Invalide parameter for set minutes.");
		}
		this._ms = this._ms - minute * (value - this.minutes);
	}

	get hours(): number {
		return Math.floor((Math.abs(this._ms) / hour) % 24);
	}
	set hours(value: number) {
		if (value < 0 || value >= 24) {
			throw new Error("TimeSpan: Invalide parameter for set hours.");
		}
		this._ms = this._ms - minute * (value - this.hours);
	}

	get days(): number {
		return Math.floor((Math.abs(this._ms) / day));
	}
	set days(value: number) {
		if (value < 0) {
			throw new Error("TimeSpan: Invalide parameter for set days.");
		}
		this._ms = this._ms - minute * (value - this.days);
	}

	get totalMilliseconds(): number {
		return this._ms;
	}
	set totalMilliseconds(value: number) {
		this._ms = value;
	}

	get totalSeconds(): number {
		return (this._ms / second);
	}
	set totalSeconds(value: number) {
		this._ms = value * second;
	}

	get totalMinutes(): number {
		return (this._ms / minute);
	}
	set totalMinutes(value: number) {
		this._ms = value * minute;
	}

	get totalHours(): number {
		return (this._ms / hour);
	}
	set totalHours(value: number) {
		this._ms = value * hour;
	}

	get totalDays(): number {
		return (this._ms / day);
	}
	set totalDays(value: number) {
		this._ms = value * day;
	}
	//#endregion

	//#region from methods
	/**
	* Returns duration for d1-d2
	*/
	static from(days: number = 0, hours: number = 0, minutes: number = 0, seconds: number = 0, ms: number = 0, negative: boolean = false): TimeSpan {
		return new TimeSpan((days * day + hours * hour + minutes * minute + seconds * second + ms * millisecond) * (negative ? -1 : 1));
	}
	static fromDateDiff(d1: Date, d2: Date): TimeSpan {
		return TimeSpan.fromMilliseconds(d1.getTime() - d2.getTime());
	}
	static fromMilliseconds(ms: number): TimeSpan {
		var ts = new TimeSpan();
		ts.totalMilliseconds = ms;
		return ts;
	}
	static fromSeconds(secs: number): TimeSpan {
		return new TimeSpan(secs * second);
	}
	static fromMinutes(minutes: number): TimeSpan {
		return new TimeSpan(minutes * minute);
	}
	static fromHours(hours: number): TimeSpan {
		return new TimeSpan(hours * hour);
	}
	static fromDays(days: number): TimeSpan {
		return new TimeSpan(days * day);
	}
	//#endregion

	//#region operations
	negate(): TimeSpan {
		return new TimeSpan(-this._ms);
	}
	add(duration: TimeSpan): TimeSpan {
		return new TimeSpan(this._ms + duration._ms);
	}
	addMilliseconds(ms: number): TimeSpan {
		return new TimeSpan(this._ms + ms);
	}
	addSeconds(seconds: number): TimeSpan {
		return new TimeSpan(this._ms + seconds * second);
	}
	addMinutes(minutes: number): TimeSpan {
		return new TimeSpan(this._ms + minutes * minute);
	}
	addHours(hours: number): TimeSpan {
		return new TimeSpan(this._ms + hours * hour);
	}
	addDays(days: number): TimeSpan {
		return new TimeSpan(this._ms + days * day);
	}
	substract(duration: TimeSpan): TimeSpan {
		return this.add(duration.negate());
	}

	//#endregion

	//#region parse
	static parse(value: number|string|TimeSpan): TimeSpan {
		var duration = TimeSpan.tryParse(value);
		if (!duration) {
			throw Error("Invalide duration value: '" + value + "'. Valid format is '[+-][days.]hh:mm:ss[.milliseconds]'.");
		}
		return duration;
	}

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

	static tryParse(value: number|string|TimeSpan): TimeSpan {
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
			if (!isNaN(parsedValue) && parsedValue == <any>value) {
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
	}
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

	toString(format: string = "HH:MM:SS"): string {
		function replace(text: string, formatItem: string, value: number, leadingZeroCount?: number) {
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

		var s = this.seconds,
			m = this.minutes,
			h = this.hours;


		var text = replace(format, "HH", h, 2);
		text = replace(text, "hh", h);
		text = replace(text, "MM", m, 2);
		text = replace(text, "mm", m);
		text = replace(text, "SS", s, 2);
		text = replace(text, "ss", s);

		return text;
	}
	//#endregion

	//#region comparison
	static compare(d1: TimeSpan, d2: TimeSpan): number {
		return d1._ms === d2._ms ? 0 : (d1._ms < d2._ms ? -1 : 1);
	}
	static equal(d1: TimeSpan, d2: TimeSpan): boolean {
		return TimeSpan.compare(d1, d2) === 0;
	}
	static less(d1: TimeSpan, d2: TimeSpan): boolean {
		return TimeSpan.compare(d1, d2) < 0;
	}
	static lessOrEqual(d1: TimeSpan, d2: TimeSpan): boolean {
		return TimeSpan.compare(d1, d2) <= 0;
	}
	static more(d1: TimeSpan, d2: TimeSpan): boolean {
		return TimeSpan.compare(d1, d2) > 0;
	}
	static moreOrEqual(d1: TimeSpan, d2: TimeSpan): boolean {
		return TimeSpan.compare(d1, d2) >= 0;
	}

	get isZero(): boolean {
		return this._ms === 0;
	}
	get isPositive(): boolean {
		return this._ms > 0;
	}
	get isNegative(): boolean {
		return this._ms < 0;
	}
	compare(d: TimeSpan): number {
		return TimeSpan.compare(this, d);
	}
	equalTo(d: TimeSpan): boolean {
		return TimeSpan.equal(this, d);
	}
	lessThen(d: TimeSpan): boolean {
		return TimeSpan.less(this, d);
	}
	lessOrEqualThen(d: TimeSpan): boolean {
		return TimeSpan.lessOrEqual(this, d);
	}
	moreThen(d: TimeSpan): boolean {
		return TimeSpan.more(this, d);
	}
	moreOrEqualThen(d: TimeSpan): boolean {
		return TimeSpan.moreOrEqual(this, d);
	}

	//#endregion
}

export =TimeSpan;
