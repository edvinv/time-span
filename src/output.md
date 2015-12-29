

<!-- Start time-span.ts -->

## constructor

Creates new TimeSpan instance

### Params:

* *value* same as tryParse function

## set(value)

Changes current TimeSpan instance 

### Params:

* *value* same as tryParse function

## from()

Returns duration for d1-d2

## parse(value)

Parse value and return new TimeSpan instance or throws error if value is invalid.

### Params:

* *value* same as tryParse function

## parseToMs(value)

Parse value and return total number of miliseconds or throws error if value is invalid.

### Params:

* *value* same as tryParse function

## tryParse(value)

Parse value and return new TimeSpan instance or null if value is invalid.

### Params:

* *value* 	 - if value is undefined or null, return zero duration 
	 - if value is instance of Duration return new TimeSpan instance with same duration
	 - if value is number, value is treated as milliseconds
	 - otherwise following pattern is used:	([+-][days.][hh:]mm:ss[.milliseconds])|(totalMiliseconds)

## tryParseToMs(value)

Parse value and return total number of miliseconds or null is value is invalid

### Params:

* *value* same as tryParse function

## toString()

format string specification:
%- sign ('-' if negative, '' if positive)
%+ sign ('-' if negative, '+' if positive)
%d days without leading 0
%hh hours with leading 0
%h hours without leading 0
%mm minutes with leading 0
%m minutes without leading 0
%ss hours with leading 0
%s hours without leading 0
%t miliseconds with leading 0
%tt miliseconds without leading 0

<!-- End time-span.ts -->

