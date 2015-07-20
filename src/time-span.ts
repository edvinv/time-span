var millisecond = 1,
	second = 1000 * millisecond,
	minute = 60 * second,
	hour = 60 * minute,
	day = 24 * hour,
	week = 7 * day;

class TimeSpan {

	private _ms: number = 0;
	static zero = new TimeSpan(0);

	/**
	 * Creates new TimeSpan instance
	 * @param value same as tryParse function 
	 */
	constructor(value?: number|string|TimeSpan) {
		if (value !== undefined) {
			this.set(value);
		}
	}

	//#region properties
	/**
	 * Changes current TimeSpan instance 
	 * @param value same as tryParse function 
	 */
	set(value?: number|string|TimeSpan): TimeSpan {
		var ms = TimeSpan.parseToMs(value);
		this.totalMilliseconds = ms;
		return this;
	}

	get milliseconds(): number {
		return Math.abs(this.totalMilliseconds) % 1000;
	}
	set milliseconds(value: number) {
		if (value < 0 || value >= 1000 || Math.round(value) !== value) {
			throw new Error("TimeSpan: Invalide parameter for set milliseconds.");
		}
		this.totalMilliseconds += (value - this.milliseconds) * (this.isNegative ? -1 : 1);
	}

	get seconds(): number {
		return Math.floor((Math.abs(this.totalMilliseconds) / second) % 60);
	}
	set seconds(value: number) {
		if (value < 0 || value >= 60 || Math.round(value) !== value) {
			throw new Error("TimeSpan: Invalide parameter for set seconds.");
		}
		this.totalMilliseconds += second * (value - this.seconds) * (this.isNegative ? -1 : 1);
	}

	get minutes(): number {
		return Math.floor((Math.abs(this.totalMilliseconds) / minute) % 60);
	}
	set minutes(value: number) {
		if (value < 0 || value >= 60 || Math.round(value) !== value) {
			throw new Error("TimeSpan: Invalide parameter for set minutes.");
		}
		this.totalMilliseconds += minute * (value - this.minutes) * (this.isNegative ? -1 : 1);;
	}

	get hours(): number {
		return Math.floor((Math.abs(this.totalMilliseconds) / hour) % 24);
	}
	set hours(value: number) {
		if (value < 0 || value >= 24 || Math.round(value) !== value) {
			throw new Error("TimeSpan: Invalide parameter for set hours.");
		}
		this.totalMilliseconds += hour * (value - this.hours) * (this.isNegative ? -1 : 1);;
	}

	get days(): number {
		return Math.floor((Math.abs(this.totalMilliseconds) / day));
	}
	set days(value: number) {
		if (value < 0 || Math.round(value) !== value) {
			throw new Error("TimeSpan: Invalide parameter for set days.");
		}
		this.totalMilliseconds += day * (value - this.days) * (this.isNegative ? -1 : 1);;
	}

	get totalMilliseconds(): number {
		return this._ms;
	}
	set totalMilliseconds(value: number) {
		this._ms = Math.round(value);
	}

	get totalSeconds(): number {
		return (this.totalMilliseconds / second);
	}
	set totalSeconds(value: number) {
		this.totalMilliseconds = value * second;
	}

	get totalMinutes(): number {
		return (this.totalMilliseconds / minute);
	}
	set totalMinutes(value: number) {
		this.totalMilliseconds = value * minute;
	}

	get totalHours(): number {
		return (this.totalMilliseconds / hour);
	}
	set totalHours(value: number) {
		this.totalMilliseconds = value * hour;
	}

	get totalDays(): number {
		return (this.totalMilliseconds / day);
	}
	set totalDays(value: number) {
		this.totalMilliseconds = value * day;
	}
	//#endregion

	//#region TimeSpan instantiation methods
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
		return new TimeSpan(-this.totalMilliseconds);
	}
	add(duration: TimeSpan): TimeSpan {
		return new TimeSpan(this.totalMilliseconds + duration.totalMilliseconds);
	}
	addMilliseconds(ms: number): TimeSpan {
		return new TimeSpan(this.totalMilliseconds + ms);
	}
	addSeconds(seconds: number): TimeSpan {
		return new TimeSpan(this.totalMilliseconds + seconds * second);
	}
	addMinutes(minutes: number): TimeSpan {
		return new TimeSpan(this.totalMilliseconds + minutes * minute);
	}
	addHours(hours: number): TimeSpan {
		return new TimeSpan(this.totalMilliseconds + hours * hour);
	}
	addDays(days: number): TimeSpan {
		return new TimeSpan(this.totalMilliseconds + days * day);
	}
	substract(duration: TimeSpan): TimeSpan {
		return this.add(duration.negate());
	}

	//#endregion

	//#region parse
	/**
		* Parse value and return new TimeSpan instance or throws error if value is invalid.
		* @param value same as tryParse function 
		*/
	static parse(value: number|string|TimeSpan): TimeSpan {
		var ts = TimeSpan.tryParse(value);
		if (!ts) {
			throw Error("Invalide duration value: '" + value + "'. Valid format is '[+-][days.]hh:mm:ss[.milliseconds]'.");
		}
		return ts;
	}

	/**
		* Parse value and return total number of miliseconds or throws error if value is invalid.
		* @param value same as tryParse function 
		*/
	static parseToMs(value: number|string|TimeSpan): number {
		var ms = TimeSpan.tryParseToMs(value);
		if (ms === null) {
			throw Error("Invalide duration value: '" + value + "'. Valid format is '[+-][days.]hh:mm:ss[.milliseconds]'.");
		}
		return ms;
	}

	/**
	* Parse value and return new TimeSpan instance or null if value is invalid.
	* @param value
	* 	 - if value is undefined or null, return zero duration 
	* 	 - if value is instance of Duration return new TimeSpan instance with same duration
	* 	 - if value is number, value is treated as milliseconds
	* 	 - otherwise following pattern is used:	([+-][days.][hh:]mm:ss[.milliseconds])|(totalMiliseconds)
	*/
	static tryParse(value: number|string|TimeSpan): TimeSpan {
		var ms = TimeSpan.tryParseToMs(value);
		return ms === null ? null : new TimeSpan(ms);
	}
	
	/**
		* Parse value and return total number of miliseconds or null is value is invalid
		* @param value same as tryParse function 
		*/
	static tryParseToMs(value: number|string|TimeSpan): number {
		// if value is undefined or null return zero duration
		if (value == null) {
			return 0;
		}
		
		// if value is already TimeSpan instance return new TimeSpan instance
		if (value instanceof TimeSpan) {
			return value.totalMilliseconds;
		}

		// if value is number then this are miliseconds
		if (typeof value === "number") {
			return value;
		}

		if (typeof value === "string") {
			var durationRegex = /^((([\-\+])?((\d+)(\.))?(([01]?\d|2[0123]):)?([012345]?\d):([012345]?\d)((\.)(\d{1,3}))?)|([+-]?\d+))$/g;
			var res = durationRegex.exec(value);
			if (!res) {
				return null;
			}

			if (res[14]) {
				// string represent total milliseconds
				return parseInt(res[14], 10);
			}
			return (
				(res[5] !== undefined ? day * parseInt(res[5], 10) : 0) +
				(res[8] !== undefined ? hour * parseInt(res[8], 10) : 0) +
				minute * parseInt(res[9], 10) +
				second * parseInt(res[10], 10) +
				(res[13] !== undefined ? parseInt(res[13], 10) : 0)
				) * (res[3] === '-' ? -1 : 1);
		}
		return null;
	}
	//#endregion

	//#region formating
	/**
		 * format string specification:
		 * %- sign ('-' if negative, '' if positive)
		 * %+ sign ('-' if negative, '+' if positive)
		 * %d days without leading 0
		 * %hh hours with leading 0
		 * %h hours without leading 0
		 * %mm minutes with leading 0
		 * %m minutes without leading 0
		 * %ss hours with leading 0
		 * %s hours without leading 0
		 * %t miliseconds with leading 0
		 * %tt miliseconds without leading 0
		 */

	toString(format: string = "%-%d.%hh:%mm:%ss.%t"): string {
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

		var d = this.seconds,
			s = this.seconds,
			m = this.minutes,
			h = this.hours,
			ms = this.milliseconds;


		var
			text = replace(format, "%d", d);
		text = replace(text, "%hh", h, 2);
		text = replace(text, "%h", h);
		text = replace(text, "%mm", m, 2);
		text = replace(text, "%m", m);
		text = replace(text, "%ss", s, 2);
		text = replace(text, "%s", s);
		text = replace(text, "%t", ms);
		text = text.replace("%-", this.isNegative ? "-" : "");
		text = text.replace("%+", this.isNegative ? "-" : "+");

		return text;
	}
	//#endregion

	//#region comparison
	static compare(d1: TimeSpan, d2: TimeSpan): number {
		return d1.totalMilliseconds === d2.totalMilliseconds ? 0 : (d1.totalMilliseconds < d2.totalMilliseconds ? -1 : 1);
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
		return this.totalMilliseconds === 0;
	}
	get isPositive(): boolean {
		return this.totalMilliseconds > 0;
	}
	get isNegative(): boolean {
		return this.totalMilliseconds < 0;
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
