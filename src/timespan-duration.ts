
export class Ticks {

  s: number;
  ns: number;

  constructor(s?: number, ns?: number) {
    if (typeof s === "undefined") {
      s = 0;
    }
    if (typeof ns === "undefined") {
      ns = 0;
    }
    this.set(s, ns);
  }

  set(s: number, ns: number): Ticks {
    this.s = s;
    this.ns = ns;
    return this.normalize();
  }
  /**
   *  
   */
  private normalize(): Ticks {
    if (this.ns >= 1e9) {
      this.s += Math.floor(this.ns / 1e9);
      this.ns = this.ns % 1e9;
    } else if (this.ns <= -1e9) {
      this.s += Math.ceil(this.ns / 1e9);
      this.ns = this.ns % 1e9;
    }
    if (this.s > 0 && this.ns < 0) {
      this.s--;
      this.ns = 1e9 + this.ns;
    } else if (this.s < 0 && this.ns > 0) {
      this.s++;
      this.ns = 1e9 - this.ns;
    }
    return this;
  }

  add(ticks: Ticks): Ticks {
    this.s += ticks.s;
    this.ns += ticks.ns;
    return this.normalize();
  }

  substract(ticks: Ticks): Ticks {
    this.s -= ticks.s;
    this.ns -= ticks.ns;
    return this.normalize();
  }

  compare(ticks: Ticks) {
    if (this.s === ticks.s && this.ns === ticks.ns) {
      return 0;
    }
    if (this.s > ticks.s || (this.s === ticks.s && this.ns > ticks.ns)) {
      return 1;
    }
    return -1;
  }

  isZero(): boolean {
    return this.s === 0 && this.ns === 0;
  }

  sign(): number {
    return this.isZero() ? 0 : ((this.s < 0 || this.ns < 0) ? -1 : 1);
  }
}

var second = 1,
  minute = 60 * second,
  hour = 60 * minute,
  day = 24 * hour,
  week = 7 * day;


export interface Format {
  parse: ((val: string) => TimeSpan) | RegExp;
  format: (timespan: TimeSpan) => string | string;
}

export class TimeSpan {
  ticks: Ticks;
  /**
     * Creates new TimeSpan instance
     */
  constructor();
  constructor(value: string, format?: string | Format | RegExp);
  constructor(value: TimeSpan);
  constructor(ms: number);
  constructor(hours: number, minutes: number, seconds: number);
  constructor(days: number, hours: number, minutes: number, seconds: number);
  constructor(days: number, hours: number, minutes: number, seconds: number, ns: number);
  constructor(value?: any) {
    if (value !== undefined) {
      this.set.apply(this, arguments);
    }
  }

  set();
  set(value: string, format?: string | Format | RegExp);
  set(value: TimeSpan);
  set(ms: number);
  set(hours: number, minutes: number, seconds: number);
  set(days: number, hours: number, minutes: number, seconds: number);
  set(days: number, hours: number, minutes: number, seconds: number, ns: number);
  set(value?: any) {
    if (value !== undefined) {
      this.set.apply(this, arguments);
    }
  }
}


function tryParse();
function tryParse(value: string, format?: string | Format | RegExp);
function tryParse(value: TimeSpan);
function tryParse(ms: number);
function tryParse(hours: number, minutes: number, seconds: number);
function tryParse(days: number, hours: number, minutes: number, seconds: number);
function tryParse(days: number, hours: number, minutes: number, seconds: number, ns: number);
function tryParse(value?: any, p1?: any, p2?: number, p3?: number, p4?: number): Ticks {
  // if value is undefined or null return zero duration
  if (value == null) {
    return new Ticks();
  }

  if (typeof (value) === 'string') {
    return tryParseText(value, p1);
  }	
    
  // if value is already TimeSpan instance return totalMilliseconds of that value
  if (value instanceof TimeSpan) {
    return value.ticks;
  }

  if (typeof (value) === 'number' && typeof (p1) === 'number' && typeof (p2) === 'number') {
    if (p3 === undefined) {
      return new Ticks(value * hour + p1 * minute + p2 * second, 0);
    } else if (typeof (p2) === 'number') {
      if (p4 === undefined) {
        return new Ticks(value * day + p1 * hour + p2 * minute + p3 * second, 0);
      } else if (typeof (p3) === 'number') {
        return new Ticks(value * day + p1 * hour + p2 * minute + p3 * second, p4);
      }
    }
  }
}

function tryParseText(value: string, format?: string | Format | RegExp): Ticks {
  return new Ticks();
  /*
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
  ) * (res[3] === '-' ? -1 : 1);*/
}