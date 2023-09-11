export default class DateProvider {
    date?: Date

    constructor(date?: Date) {
        this.date = date;
    }

    getDate(): Date {
        return this.date || new Date();
    }
}