// hour:minute:second?
// Example: 12:59:59
function getTime(date: Date, get_seconds: boolean = false): string {
    const hours = String(
        '0'
        + (
            date.getHours() > 12
                ? (date.getHours() - 12)
                : date.getHours()
        )
    ).slice(-2);

    const minutes = String('0' + date.getMinutes()).slice(-2);
    const seconds = String('0' + date.getSeconds()).slice(-2);
    return (
        hours +
        ':' +
        minutes +
        (get_seconds ? ':' + seconds : '')
    );
}

function secondConverterToTimerFormat(seconds: number): {
    year?: number;
    month?: number;
    week?: number;
    day?: number;
    hours: number;
    minutes: number;
    seconds: number;
} {
    const year = Math.floor(seconds / 31536000);
    const month = Math.floor((seconds - year * 31536000) / 2592000);
    const week = Math.floor((seconds - year * 31536000 - month * 2592000) / 604800);
    const day = Math.floor(
        (seconds - year * 31536000 - month * 2592000 - week * 604800) / 86400
    );
    const hours = Math.floor(
        (seconds - year * 31536000 - month * 2592000 - week * 604800 - day * 86400) / 3600
    );
    const minutes = Math.floor(
        (seconds -
            year * 31536000 -
            month * 2592000 -
            week * 604800 -
            day * 86400 -
            hours * 3600) /
        60
    );
    const seconds_left = Math.floor(
        seconds -
        year * 31536000 -
        month * 2592000 -
        week * 604800 -
        day * 86400 -
        hours * 3600 -
        minutes * 60
    );
    return {
        year: year,
        month: month,
        week: week,
        day: day,
        hours: hours,
        minutes: minutes,
        seconds: seconds_left,
    };
}

export { getTime, secondConverterToTimerFormat };
