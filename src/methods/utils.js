import Moment from "moment";

export function time(timeParse) {
    let date = new Moment(timeParse);
    return date.format("YYYY-MM-DD HH:mm:ss");
}

export function copy(content) {
    navigator.clipboard.writeText(content.trim());
}
