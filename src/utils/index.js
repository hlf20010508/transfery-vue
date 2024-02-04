export function getCurrentTimeStamp() {
    return new Date().getTime()
}

export function isSameDate(timestamp1, timestamp2) {
    let date1 = new Date(timestamp1).toLocaleDateString();
    let date2 = new Date(timestamp2).toLocaleDateString();
    return date1 === date2;
}