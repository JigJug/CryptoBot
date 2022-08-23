"use strict";
let date = new Date();
console.log(date);
console.log(date.getTime());
let hourPlusMinute;
function addZero(i) {
    if (i < 10) {
        i = "0" + i;
    }
    return i;
}
function getTimeNow() {
    return new Promise((resolve, reject) => {
        let dateTime = new Date();
        let h = addZero(dateTime.getUTCHours());
        let m = addZero(dateTime.getUTCMinutes());
        let s = addZero(dateTime.getUTCSeconds());
        hourPlusMinute = h + ':' + m;
        console.log(hourPlusMinute);
        resolve(hourPlusMinute);
        reject(new Error('Could not get time'));
    });
}
console.log(getTimeNow());
