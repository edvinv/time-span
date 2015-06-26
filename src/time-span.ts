var millisecond = 1,
	second = 1000 * millisecond,
	minute = 60 * second,
	hour = 60 * minute,
	day = 24 * hour,
	week = 7 * day;

export class Duration {
	//#region fields
	private _ms: number;
	static zero = new Duration(0);
	//#endregion

	constructor(duration?: Duration);
	constructor(duration?: string);
	constructor(duration?: number);
	constructor(duration?: any) {
		if (duration instanceof Duration) {
			duration = (<Duration>duration)._ms;
		}
		switch (typeof duration) {
			case "number":
				this._ms = duration;
				break;
			case "string":
				this._ms = Duration.parse(<string>duration)._ms;
				break;
			case "undefined":
				this._ms = 0;
				break;
			default:
				this._ms = 0;
				break;
		}
	}

	//#region properties
	get milliseconds(): number {
		return Math.floor(Math.abs(this._ms) % 1000);
	}
	get seconds(): number {
		return Math.floor((Math.abs(this._ms) / second) % 60);
	}
	get minutes(): number {
		return Math.floor((Math.abs(this._ms) / minute) % 60);
	}
	get hours(): number {
		return Math.floor((Math.abs(this._ms) / hour) % 24);
	}
	get days(): number {
		return Math.floor((Math.abs(this._ms) / day));
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
	get totalMinutes(): number {
		return (this._ms / minute);
	}
	get totalHours(): number {
		return (this._ms / hour);
	}
	get totalDays(): number {
		return (this._ms / day);
	}
	//#endregion

	//#region rounding
	adjustSeconds(adjustFunc: (value: number) => number): Duration {
		this._ms = 1000 * adjustFunc(this._ms / 1000);
		return this;
	}
	roundSeconds: () => Duration = this.adjustSeconds.bind(this, Math.round);
	ceilSeconds: () => Duration = this.adjustSeconds.bind(this, Math.ceil);
	floorSeconds: () => Duration = this.adjustSeconds.bind(this, Math.floor);
	//#endregion

	//#region from methods
	/**
	* Returns duration for d1-d2
	*/
	static from(days: number = 0, hours: number = 0, minutes: number = 0, seconds: number = 0, ms: number = 0, negative: boolean = false): Duration {
		return new Duration((days * day + hours * hour + minutes * minute + seconds * second + ms * millisecond) * (negative ? -1 : 1));
	}
	static fromDateDiff(d1: Date, d2: Date): Duration {
		return Duration.fromMilliseconds(d1.getTime() - d2.getTime());
	}
	static fromMilliseconds(ms: number): Duration {
		return new Duration(ms);
	}
	static fromSeconds(secs: number): Duration {
		return new Duration(secs * second);
	}
	static fromMinutes(minutes: number): Duration {
		return new Duration(minutes * minute);
	}
	static fromHours(hours: number): Duration {
		return new Duration(hours * hour);
	}
	static fromDays(days: number): Duration {
		return new Duration(days * day);
	}
	//#endregion

	//#region Time operation
	static substract(t1: Date, t2: Date): Duration {
		return new Duration(t1.getTime() - t2.getTime());
	}
	//#endregion

	//#region operations
	negate(): Duration {
		return new Duration(-this._ms);
	}
	add(duration: Duration): Duration {
		return new Duration(this._ms + duration._ms);
	}
	addMilliseconds(ms: number): Duration {
		return new Duration(this._ms + ms);
	}
	addSeconds(seconds: number): Duration {
		return new Duration(this._ms + seconds * second);
	}
	addMinutes(minutes: number): Duration {
		return new Duration(this._ms + minutes * minute);
	}
	addHours(hours: number): Duration {
		return new Duration(this._ms + hours * hour);
	}
	addDays(days: number): Duration {
		return new Duration(this._ms + days * day);
	}
	substract(duration: Duration): Duration {
		return this.add(duration.negate());
	}

	//#endregion

	//#region parse
	static parse(value: string): Duration;
	static parse(value: number): Duration;
	static parse(value: any): Duration {
		var duration = Duration.tryParse(value);
		if (!duration) {
			throw Error("Invalide duration value: '" + value + "'. Valid format is '[+-][days.]hh:mm:ss[.milliseconds]'.");
		}
		return duration;
	}

	/**
	* value is in following format:
	* 	 - if value Duration the just return value
	* 	 - if value is number, value is treated as milliseconds
	* 	 - if value is string representation of number (float) then is treated as milliseconds
	* 	 
	*	otherwise following pattern is used: 
	*		[+-][days.]hh:mm:ss[.milliseconds]
	* - null is returned in the case of error
	*/

	static tryParse(value: Duration): Duration;
	static tryParse(value: string): Duration;
	static tryParse(value: number): Duration;
	static tryParse(value: any): Duration {
		// if value is already duration return duration
		if (value instanceof Duration) {
			return value;
		}
		// if value is number then this are milisecondsn
		if (typeof value === "number") {
			return Duration.fromMilliseconds(value);
		}

		// if value is string and is float number then this are miliseconds
		var durationString = <string>value;
		if (/^(\-|\+)?([0-9]+(\.[0-9]+)?)$/.test(durationString)) {
			return Duration.fromMilliseconds(parseFloat(durationString));
		}

		var durationRegex = /^([\-\+])?((\d+)(\.))?([01]?\d|2[0123]):([012345]?\d):([012345]?\d)((\.)(\d+))?$/g;
		var res = durationRegex.exec(durationString);
		if (!res) {
			return null;
		}
		return Duration.from(res[3] !== undefined ? parseInt(res[3], 10) : 0, parseInt(res[5], 10), parseInt(res[6], 10), parseInt(res[7], 10), res[10] !== undefined ? parseInt(res[10], 10) : 0, res[1] === '-');
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
	static compare(d1: Duration, d2: Duration): number {
		return d1._ms === d2._ms ? 0 : (d1._ms < d2._ms ? -1 : 1);
	}
	static equal(d1: Duration, d2: Duration): boolean {
		return Duration.compare(d1, d2) === 0;
	}
	static less(d1: Duration, d2: Duration): boolean {
		return Duration.compare(d1, d2) < 0;
	}
	static lessOrEqual(d1: Duration, d2: Duration): boolean {
		return Duration.compare(d1, d2) <= 0;
	}
	static more(d1: Duration, d2: Duration): boolean {
		return Duration.compare(d1, d2) > 0;
	}
	static moreOrEqual(d1: Duration, d2: Duration): boolean {
		return Duration.compare(d1, d2) >= 0;
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
	compare(d: Duration): number {
		return Duration.compare(this, d);
	}
	equalTo(d: Duration): boolean {
		return Duration.equal(this, d);
	}
	lessThen(d: Duration): boolean {
		return Duration.less(this, d);
	}
	lessOrEqualThen(d: Duration): boolean {
		return Duration.lessOrEqual(this, d);
	}
	moreThen(d: Duration): boolean {
		return Duration.more(this, d);
	}
	moreOrEqualThen(d: Duration): boolean {
		return Duration.moreOrEqual(this, d);
	}

	//#endregion
}

