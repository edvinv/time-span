# [In progress]


# TimeSpan
Time span represents time interval/duration. For detailed description please check API section.

## Installation
``` bash
npm install time-span
```

## Use
``` javascript
var ts=new TimeSpan("01:22:44.516");
ts.addHours(1);
console.log(ts.toString()); // 02:22:44.516
```

## Quick guide

### TimeSpan intatiation
To create new TimeSpan instance use following methods:
``` javascript
var ts=new new TimeSpan(12000); // create from milliseconds 
ts=new new TimeSpan("02:22:44.516"); // create from string
ts=new TimeSpan.from(1 /*days*/,2 /*hours*/, 3 /*minutes*/, 4 /*seconds*/, 5 /*milliseconds*/, true /*positive/negative*/);
ts=new TimeSpan.fromDateDiff(new Date(),new Date("October 13, 2014 11:13:00"));
ts=new TimeSpan.fromSeconds(123.45);
ts=new TimeSpan.fromMinutes(12345);
ts=new TimeSpan.fromHours(12,45);
ts=new TimeSpan.fromDays(-365);
```

### Get/Set individual TimeSpan components (days, hours, minutes, seconds, milliseconds) as whole component
``` javascript
var ts=new new TimeSpan("1.02:03:04.576"); // create from string
ts.days=9;
ts.hours=9;
ts.minutes=9;
ts.seconds=9;
ts.milliseconds=9999;
console.log(ts.toString()); // 9.09:09:09.999
```

### Get/Set individual TimeSpan components (days, hours, minutes, seconds, milliseconds) as whole and fractional component
``` javascript
var ts=new new TimeSpan("1:0:0");
console.log(ts.totalDays); // 0.041666
console.log(ts.totalHours); // 1
console.log(ts.totalMinutes); // 60
console.log(ts.totalSeconds); // 3600
console.log(ts.totalMilliseconds); // 3600000
```

### Parsing TimeSpan


### Formating TimeSpan


### Comparing TimeSpan values


### TimeSpan operations


