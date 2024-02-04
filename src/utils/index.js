export function getCurrentTimeStamp() {
    return new Date().getTime()
}

export function shouldShowDate(timestamp1, timestamp2) {
    let date1 = new Date(timestamp1).toISOString().split('T')[0];
    let date2 = new Date(timestamp2).toISOString().split('T')[0];
    return date1 != date2;
}