export interface Format {
    parse: ((val: string) => TimeSpan) | RegExp;
    toString: (timespan: TimeSpan) => string | string;
}
export default class TimeSpan {
    private _ms;
    static zero: TimeSpan;
    private static formats;
    /**
     * Creates new TimeSpan instance
     */
    constructor();
    constructor(value: string);
    constructor(value: string, format: string | Format);
    constructor(value: TimeSpan);
    constructor(ms: number);
    constructor(hours: number, minutes: number, seconds: number);
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
    set(value?: number | string | TimeSpan): TimeSpan;
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
    static parse(value: number | string | TimeSpan): TimeSpan;
    /**
        * Parse value and return total number of miliseconds or throws error if value is invalid.
        * @param value same as tryParse function
        */
    static parseToMs(value: number | string | TimeSpan): number;
    /**
    * Parse value and return new TimeSpan instance or null if value is invalid.
    * @param value
    * 	 - if value is undefined or null, return zero duration
    * 	 - if value is instance of Duration return new TimeSpan instance with same duration
    * 	 - if value is number, value is treated as milliseconds
    * 	 - otherwise following pattern is used:	([+-][days.][hh:]mm:ss[.milliseconds])|(totalMiliseconds)
    */
    static tryParse(value: number | string | TimeSpan): TimeSpan;
    /**
        * Parse value and return total number of miliseconds or null is value is invalid
        * @param value same as tryParse function
        */
    static tryParseToMs(value: number | string | TimeSpan): number;
    private static leadingZeros(n, count);
    private static formatters;
    private static maxFormatterCmdLength;
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
    toString(format?: string): string;
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
