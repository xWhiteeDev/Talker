import {ACCOUNT_CONFIG} from "../../../../../configurations/account.config";
import {PERSONAL_CONFIG} from "../../../../../configurations/personal.config";
import {Validify} from "../../../../../services/Validify";
import type {IAccount, IPersonal} from "./types";

export function getAge(birthdayDate: Date, currentDate: Date) {
    let age = currentDate.getFullYear() - birthdayDate.getFullYear();
    const birthdayMonth = birthdayDate.getMonth() + 1;
    const birthdayDay = birthdayDate.getDate();
    const currentMonth = currentDate.getMonth() + 1;
    const currentDay = currentDate.getDate();
    const hadBirthday = (currentMonth > birthdayMonth) || (currentMonth === birthdayMonth && currentDay >= birthdayDay);
    if (!hadBirthday) age--;
    return age;
}


export function isPersonalDataValid(data: IPersonal) {
    if (!data.firstName || !data.lastName) return false;
    return (Validify.validateString(data.firstName, {
        minLength: PERSONAL_CONFIG.FIRST_NAME.MIN,
        maxLength: PERSONAL_CONFIG.FIRST_NAME.MAX,
        canBeNull: false,
        regex: /^[^0-9]*$/,
    }) && Validify.validateString(data.lastName, {
        minLength: PERSONAL_CONFIG.LAST_NAME.MIN,
        maxLength: PERSONAL_CONFIG.LAST_NAME.MAX,
        canBeNull: false,
        regex: /^[^0-9]*$/,
    }) && data.birthdayDate != undefined && getAge(new Date(data.birthdayDate), new Date()) >= PERSONAL_CONFIG.BIRTHDAY.MIN_AGE && getAge(new Date(data.birthdayDate), new Date()) <= PERSONAL_CONFIG.BIRTHDAY.MAX_AGE);
}


export function isAccountDataValid(data: IAccount) {
    if (!data.email || !data.password || !data.repassword) return false;
    return (
        Validify.validateString(data.email, {
            minLength: ACCOUNT_CONFIG.EMAIL.MIN,
            maxLength: ACCOUNT_CONFIG.EMAIL.MAX,
            trimmed: true,
            regex: /[^@]+@[^@]+\.[^@]+/
        }) &&
        Validify.validateString(data.password, {
            minLength: ACCOUNT_CONFIG.PASSWORD.MIN,
            maxLength: ACCOUNT_CONFIG.PASSWORD.MAX,
            trimmed: true,
        }) &&
        Validify.validateString(data.repassword, {
            minLength: ACCOUNT_CONFIG.PASSWORD.MIN,
            maxLength: ACCOUNT_CONFIG.PASSWORD.MAX,
            trimmed: true,
        }) && Validify.validateString(data.password, {expectedValues: [data.repassword]})
    );
}

