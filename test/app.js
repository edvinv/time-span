//import TimeSpan = require('../src/time-span');
var regex = /(\(\?\<(\w+)\>([^\)]+)\))/g;
var test1 = "(ure=(?<hour>\\d\\d)\\sminute=(?<minute>\\d\\d))";
var r = test1.match(regex);
var n = "";
var lastIndex = 0;
var ff = test1.match(regex);
while ((r = regex.exec(test1)) !== null) {
    if (lastIndex < r.index) {
        n += test1.substring(lastIndex, r.index);
    }
    n += "(" + r[3] + ")"; //test1.substring(r.index, regex.lastIndex);
    lastIndex = regex.lastIndex;
}
if (lastIndex < test1.length) {
    n += test1.substring(lastIndex);
}
var rg = new RegExp(n);
var f = "ure=23 minute=21".match(rg);
console.log("end");
//# sourceMappingURL=app.js.map