export declare class Ticks {
    s: number;
    ns: number;
    constructor(s?: number, ns?: number);
    set(s: number, ns: number): Ticks;
    /**
     *
     */
    private normalize();
    add(ticks: Ticks): Ticks;
    substract(ticks: Ticks): Ticks;
    compare(ticks: Ticks): number;
    isZero(): boolean;
    sign(): number;
}
export interface Format {
    parse: ((val: string) => TimeSpan) | RegExp;
    format: (timespan: TimeSpan) => string | string;
}
export declare class TimeSpan {
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
    set(): any;
    set(value: string, format?: string | Format | RegExp): any;
    set(value: TimeSpan): any;
    set(ms: number): any;
    set(hours: number, minutes: number, seconds: number): any;
    set(days: number, hours: number, minutes: number, seconds: number): any;
    set(days: number, hours: number, minutes: number, seconds: number, ns: number): any;
}
