//import TimeSpan = require('../src/time-span');

let regex = /(\(\?\<(\w+)\>([^\)]+)\))/g;
let test1 = "(ure=(?<hour>\\d\\d)\\sminute=(?<minute>\\d\\d))";

let r = test1.match(regex);

let n = "";
let lastIndex = 0;

let ff=test1.match(regex);

while ((r = regex.exec(test1)) !== null) {
	if (lastIndex < r.index) {
		n += test1.substring(lastIndex, r.index);
	}
	n += "("+r[3]+")";//test1.substring(r.index, regex.lastIndex);
	lastIndex = regex.lastIndex;
}
if (lastIndex < test1.length) {
	n += test1.substring(lastIndex);
}



let rg=new RegExp(n);
let f="ure=23 minute=21".match(rg);

console.log("end");
