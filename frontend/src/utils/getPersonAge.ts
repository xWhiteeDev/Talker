export function getPersonAgeByDate(date: string): number | null {
    const regex = /^\d{4}-\d{2}-\d{2}$/
    const isDateCorrectFormat = regex.test(date);
    if (!isDateCorrectFormat) return null
    const isPassedDateValid = isDateValid(date)
    if (!isPassedDateValid) return null

    const today = new Date()
    let correctMonth = today.getMonth() + 1;

    const [birthYear, birthMonth, birthDay] = date.split('-').map(Number);

    let yearlyAge: number = today.getFullYear() - birthYear

    const calculatedBirth = birthMonth * 100 + birthDay;
    const calculatedToday = correctMonth * 100 + today.getDate();
    if (calculatedToday >= calculatedBirth) {
        return yearlyAge
    } else {
        return yearlyAge - 1
    }
};

function isDateValid(date: string): boolean {
    const dateSeparators = ['-', '/', '.'];
    let separator: string | null = null
    for (const dateSeparator of dateSeparators) {
        if (!date.includes(dateSeparator)) continue
        separator = dateSeparator;
        break;
    }
    if (!separator) return false
    const [year, month, day]: number[] = date.split(separator).map(Number)
    if (isNaN(year) || isNaN(month) || isNaN(day)) return false
    const today = new Date();
    if (year >= today.getFullYear() + 1 || month > 12 || month < 1 || day < 1) return false
    const testDate = new Date(year, month - 1, day)
    if (testDate.getMonth() + 1 !== month || testDate.getDate() !== day) return false;
    return true

};