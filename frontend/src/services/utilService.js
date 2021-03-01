export const utilService = {
    convertToMonthString,
    makeId,
    getTime
}

function convertToMonthString(date) {
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];
    return monthNames[new Date(date).getMonth()];
}

function makeId(length = 5) {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (var i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

function getTime(date) {
    let time = new Date(date);
    let month = convertToMonthString(time);
    let day = time.getDate();
    let hours = time.getHours();
    let minutes = time.getMinutes();
    hours = (hours < 10) ? '0' + hours : hours;
    minutes = (minutes < 10) ? '0' + minutes : minutes;
    return month + ' ' + day + ' at ' + hours + ':' + minutes;
}