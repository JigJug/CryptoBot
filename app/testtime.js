"use strict";
var date = new Date();
console.log(date);
console.log(date.getTime());
var hourPlusMinute;
function addZero(i) {
    if (i < 10) {
        i = "0" + i;
    }
    return i;
}
function getTimeNow() {
    return new Promise(function (resolve, reject) {
        var dateTime = new Date();
        var h = addZero(dateTime.getUTCHours());
        var m = addZero(dateTime.getUTCMinutes());
        var s = addZero(dateTime.getUTCSeconds());
        hourPlusMinute = h + ':' + m;
        console.log(hourPlusMinute);
        resolve(hourPlusMinute);
        reject(new Error('Could not get time'));
    });
}
console.log(getTimeNow());
