export interface Format {
    parse: ((val: string) => TimeSpan) | RegExp;
    format: (timespan: TimeSpan) => string | string;
}
export default class TimeSpan {
    private _ms;
    static zero: TimeSpan;
    private static formats;
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
    static registerFormat(name: string, format: Format): void;
    static unregisterFormat(name: string): void;
    static getFormat(format: string | Format): string | Format;
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
    milliseconds: number;
    seconds: number;
    minutes: number;
    hours: number;
    days: number;
    totalMilliseconds: number;
    totalSeconds: number;
    totalMinutes: number;
    totalHours: number;
    totalDays: number;
    /**
    * Returns duration for d1-d2
    */
    static from(days?: number, hours?: number, minutes?: number, seconds?: number, ms?: number, negative?: boolean): TimeSpan;
    static fromDateDiff(d1: Date, d2: Date): TimeSpan;
    static fromMilliseconds(ms: number): TimeSpan;
    static fromSeconds(secs: number): TimeSpan;
    static fromMinutes(minutes: number): TimeSpan;
    static fromHours(hours: number): TimeSpan;
    static fromDays(days: number): TimeSpan;
    negate(): TimeSpan;
    add(duration: TimeSpan): TimeSpan;
    addMilliseconds(ms: number): TimeSpan;
    addSeconds(seconds: number): TimeSpan;
    addMinutes(minutes: number): TimeSpan;
    addHours(hours: number): TimeSpan;
    addDays(days: number): TimeSpan;
    substract(duration: TimeSpan): TimeSpan;
    /**
        * Parse value and return new TimeSpan instance or throws error if value is invalid.
        * @param value same as tryParse function
        */
    static parse(): TimeSpan;
    static parse(value: string, format?: string | Format | RegExp): TimeSpan;
    static parse(value: TimeSpan): TimeSpan;
    static parse(ms: number): TimeSpan;
    static parse(hours: number, minutes: number, seconds: number): TimeSpan;
    static parse(days: number, hours: number, minutes: number, seconds: number): TimeSpan;
    static parse(days: number, hours: number, minutes: number, seconds: number, ms: number): TimeSpan;
    static tryParse(): TimeSpan;
    static tryParse(value: string, format?: string | Format | RegExp): TimeSpan;
    static tryParse(value: TimeSpan): TimeSpan;
    static tryParse(ms: number): TimeSpan;
    static tryParse(hours: number, minutes: number, seconds: number): TimeSpan;
    static tryParse(days: number, hours: number, minutes: number, seconds: number): TimeSpan;
    static tryParse(days: number, hours: number, minutes: number, seconds: number, ms: number): TimeSpan;
    toString(f?: Format | string): string;
    format(f?: Format | string): string;
    static compare(d1: TimeSpan, d2: TimeSpan): number;
    static equal(d1: TimeSpan, d2: TimeSpan): boolean;
    static less(d1: TimeSpan, d2: TimeSpan): boolean;
    static lessOrEqual(d1: TimeSpan, d2: TimeSpan): boolean;
    static more(d1: TimeSpan, d2: TimeSpan): boolean;
    static moreOrEqual(d1: TimeSpan, d2: TimeSpan): boolean;
    isZero: boolean;
    isPositive: boolean;
    isNegative: boolean;
    compare(d: TimeSpan): number;
    equalTo(d: TimeSpan): boolean;
    lessThen(d: TimeSpan): boolean;
    lessOrEqualThen(d: TimeSpan): boolean;
    moreThen(d: TimeSpan): boolean;
    moreOrEqualThen(d: TimeSpan): boolean;
}
