function getDateTimeFormated(dStart, dEnd) {
    // give format to the Hour
    const start = dStart.split("T");
    const end = dEnd.split("T");
    const startHour = start[1].split(":");
    const endHour = end[1].split(":");
    const startHourFormat = `${startHour[0]}:${startHour[1]}`;
    const endHourFormat = `${endHour[0]}:${endHour[1]}`;

    const printable_hour = `${startHourFormat} - ${endHourFormat}`;

    return {start: start[0], end:end[0], printable_hour: printable_hour};
}