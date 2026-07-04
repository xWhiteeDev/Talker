import type { IConfigLength, IValidators } from "../interfaces/helpers/IValidationHelpers"

export function validateLength(value: string, rules: IConfigLength): boolean {
    return value.length <= rules.max && value.length >= rules.min
}

export function validateTrim(value: string, rules: boolean): boolean {
    return rules ? value.trim().length !== 0 : true
}

export function validateRegex(value: string, rules: RegExp): boolean {
    return rules.test(value)
}
export const validatorFunctions: IValidators = {
    trim: validateTrim,
    length: validateLength,
    regex: validateRegex,
    minimalAge: validateAge
}

export function isDateValid(date: string): boolean {
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

}

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
}

export function validateAge(date: string, rule: number): boolean {
    const personAge = getPersonAgeByDate(date);
    if (!personAge) return false
    return personAge >= rule
}