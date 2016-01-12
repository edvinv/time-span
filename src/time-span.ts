var millisecond = 1,
  second = 1000 * millisecond,
  minute = 60 * second,
  hour = 60 * minute,
  day = 24 * hour,
  week = 7 * day;

export interface Format {
  parse: ((val: string) => TimeSpan) | RegExp;
  format: (timespan: TimeSpan) => string | string;
}

export default class TimeSpan {

  private _ms: number = 0;
  static zero = new TimeSpan(0);
  private static formats: { [name: string]: Format } = {};

	/**
	 * Creates new TimeSpan instance
	 */
  constructor();
  constructor(value: string, format?: string | Format | RegExp);
  constructor(value: TimeSpan);
  constructor(ms: number);
  constructor(hours: number, minutes: number, seconds: number);
  constructor(days: number, hours: number, minutes: number, seconds: number);
  constructor(days: number, hours: number, minutes: number, seconds: number, ms: number);
  constructor(value?: any) {
    if (value !== undefined) {
      this.set.apply(this, arguments);
    }
  }


  //#region formating
  static registerFormat(name: string, format: Format) {
    TimeSpan.formats[name] = format;
  }
  static unregisterFormat(name: string) {
    delete TimeSpan.formats[name];
  }
  static getFormat(format: string | Format) {
    if (typeof format === 'string') {
      format = TimeSpan.formats[<string>format];
      throw new Error("TimeSpan: Format name '" + <string>format + "' is not valid.");
    }
    return format;
  }
  //#endregion  



  //#region properties
	/**
	 * Changes current TimeSpan instance 
	 * @param value same as tryParse function 
	 */
  set(): TimeSpan;
  set(value: string, format?: string | Format | RegExp): TimeSpan;
  set(value: TimeSpan): TimeSpan;
  set(ms: number): TimeSpan;
  set(hours: number, minutes: number, seconds: number): TimeSpan;
  set(days: number, hours: number, minutes: number, seconds: number): TimeSpan;
  set(days: number, hours: number, minutes: number, seconds: number, ms: number): TimeSpan;
  set(value?: any): TimeSpan {
    var ms = tryParseToMs(value);
    if (ms === null) {
      throw Error("Invalide duration value: '" + value + "'. Valid format is '[+-][days.]hh:mm:ss[.milliseconds]'.");
    }
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
  static parse(): TimeSpan
  static parse(value: string, format?: string | Format | RegExp): TimeSpan
  static parse(value: TimeSpan): TimeSpan
  static parse(ms: number): TimeSpan
  static parse(hours: number, minutes: number, seconds: number): TimeSpan
  static parse(days: number, hours: number, minutes: number, seconds: number): TimeSpan
  static parse(days: number, hours: number, minutes: number, seconds: number, ms: number): TimeSpan;
  static parse(value?: any, p1?: any, p2?: number, p3?: number, p4?: number): TimeSpan {
    var ts = TimeSpan.tryParse(value);
    if (!ts) {
      throw Error("Invalide duration value: '" + value + "'. Valid format is '[+-][days.]hh:mm:ss[.milliseconds]'.");
    }
    return ts;
  }

  static tryParse(): TimeSpan
  static tryParse(value: string, format?: string | Format | RegExp): TimeSpan
  static tryParse(value: TimeSpan): TimeSpan
  static tryParse(ms: number): TimeSpan
  static tryParse(hours: number, minutes: number, seconds: number): TimeSpan
  static tryParse(days: number, hours: number, minutes: number, seconds: number): TimeSpan
  static tryParse(days: number, hours: number, minutes: number, seconds: number, ms: number): TimeSpan;
  static tryParse(value?: any, p1?: any, p2?: number, p3?: number, p4?: number): TimeSpan {
    var ms = tryParseToMs(value);
    return ms === null ? null : new TimeSpan(ms);
  }
	
  //#endregion

  //#region formating
  // "%-%d.%hh:%mm:%ss.%tt"
  toString(f?: Format | string): string {
    return format(this, f);
  }
  format(f?: Format | string): string {
    return format(this, f);
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

/**
 * Return duration in milliseconds based on different input parameters or null when parsing fails
 */

function tryParseToMs(): number;
function tryParseToMs(value: string, format?: string | Format | RegExp): number;
function tryParseToMs(value: TimeSpan): number;
function tryParseToMs(ms: number): number;
function tryParseToMs(hours: number, minutes: number, seconds: number): number;
function tryParseToMs(days: number, hours: number, minutes: number, seconds: number): number;
function tryParseToMs(days: number, hours: number, minutes: number, seconds: number, ms: number): number;
function tryParseToMs(value?: any, p1?: any, p2?: number, p3?: number, p4?: number): number {
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
    } else if (typeof (p2) === 'number') {
      if (p4 === undefined) {
        return value * day + p1 * hour + p2 * minute + p3 * second;
      } else if (typeof (p3) === 'number') {
        return value * day + p1 * hour + p2 * minute + p3 * second + p4;
      }
    }
  }
  throw new TypeError("Invalide arguments for parse method");
}

function tryParseText(value: string, format: string | Format | RegExp): number {
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


function leadingZeros(n: number, count: number): string {
  var r = n.toString();
  while (r.length < count) {
    r = "0" + r;
  }
  return r;
}
var formatters = {
  '%': function() { return '%'; },
  '-': function() { return this.isNegative ? "-" : ""; },
  '+': function() { return this.isNegative ? "-" : "+"; },
  'd': function() { return this.days.toString(); },
  'h': function() { return this.hours.toString(); },
  'hh': function() { return leadingZeros(this.hours, 2); },
  'm': function() { return this.minutes.toString(); },
  'mm': function() { return leadingZeros(this.minutes, 2); },
  's': function() { return this.seconds.toString(); },
  'ss': function() { return leadingZeros(this.seconds, 2); },
  't': function() { return this.milliseconds.toString(); },
  'tt': function() { return leadingZeros(this.milliseconds, 3); }
};
var maxFormatterCmdLength: number = Object.keys(formatters).reduce((p, c) => c.length > p ? c.length : p, 0);
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

function format(ts: TimeSpan, format?: Format | string) {
  /*var res = "",
    cmd: any = null,
    maxCmdLength = maxFormatterCmdLength,
    i: number,
    ic: number,
    fl = format.length,
    curr: string = null,
    formatter: () => string;

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
      } else {
        throw new Error("TimeSpan: Invalide format expression :'" + format + "'.");
      }
    } else {
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
  return res;*/
  return "";
}

//export =TimeSpan;
