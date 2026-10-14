import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ReqValid } from '../../services/Validation.js';

const bad = (value: unknown) => value as never;

beforeEach(() => {
  vi.spyOn(console, 'error').mockImplementation(() => {});
});
afterEach(() => {
  vi.restoreAllMocks();
  vi.useRealTimers();
});

describe('ReqValid.validateString', () => {
  it('accepts text within the length limits (limits included)', () => {
    const req = { minLength: 2, maxLength: 5 };
    expect(ReqValid.validateString('a', req)).toBe(false);
    expect(ReqValid.validateString('ab', req)).toBe(true);
    expect(ReqValid.validateString('abcde', req)).toBe(true);
    expect(ReqValid.validateString('abcdef', req)).toBe(false);
  });

  it('treats maxLength: 0 as a real limit', () => {
    expect(ReqValid.validateString('', { maxLength: 0 })).toBe(true);
    expect(ReqValid.validateString('a', { maxLength: 0 })).toBe(false);
  });

  it('trimmed: measures length after trimming whitespace', () => {
    expect(ReqValid.validateString('  ab  ', { minLength: 3, trimmed: true })).toBe(false);
    expect(ReqValid.validateString('  ab  ', { minLength: 3 })).toBe(true);
  });

  it('regex: checks the pattern match', () => {
    expect(ReqValid.validateString('123', { regex: /^\d+$/ })).toBe(true);
    expect(ReqValid.validateString('12a', { regex: /^\d+$/ })).toBe(false);
  });

  it('expectedValues: only allows listed values', () => {
    const req = { expectedValues: ['a', 'b'] };
    expect(ReqValid.validateString('a', req)).toBe(true);
    expect(ReqValid.validateString('c', req)).toBe(false);
    expect(ReqValid.validateString(' a ', { ...req, trimmed: true })).toBe(true);
  });

  it('rejects values that are not strings', () => {
    expect(ReqValid.validateString(bad(5), {})).toBe(false);
    expect(ReqValid.validateString(bad({}), {})).toBe(false);
    expect(ReqValid.validateString(bad([]), {})).toBe(false);
  });

  it('null/undefined: depends on canBeNull', () => {
    expect(ReqValid.validateString(bad(null), { canBeNull: true })).toBe(true);
    expect(ReqValid.validateString(bad(undefined), { canBeNull: true })).toBe(true);
    expect(ReqValid.validateString(bad(null), { canBeNull: false })).toBe(false);
    expect(ReqValid.validateString(bad(undefined), {})).toBe(false);
  });
});

describe('ReqValid.validateNumber', () => {
  it('accepts numbers within the limits (limits included)', () => {
    const req = { min: 1, max: 10 };
    expect(ReqValid.validateNumber(0, req)).toBe(false);
    expect(ReqValid.validateNumber(1, req)).toBe(true);
    expect(ReqValid.validateNumber(10, req)).toBe(true);
    expect(ReqValid.validateNumber(11, req)).toBe(false);
  });

  it('treats min: 0 as a real limit', () => {
    expect(ReqValid.validateNumber(-1, { min: 0 })).toBe(false);
    expect(ReqValid.validateNumber(0, { min: 0 })).toBe(true);
  });

  it('treats max: 0 as a real limit', () => {
    expect(ReqValid.validateNumber(1, { max: 0 })).toBe(false);
    expect(ReqValid.validateNumber(0, { max: 0 })).toBe(true);
    expect(ReqValid.validateNumber(-1, { max: 0 })).toBe(true);
  });

  it('rejects NaN and strings, even ones that look like numbers', () => {
    expect(ReqValid.validateNumber(NaN, {})).toBe(false);
    expect(ReqValid.validateNumber(bad('5'), {})).toBe(false);
    expect(ReqValid.validateNumber(bad({}), {})).toBe(false);
  });

  it('null/undefined: depends on canBeNull', () => {
    expect(ReqValid.validateNumber(bad(null), { canBeNull: true })).toBe(true);
    expect(ReqValid.validateNumber(bad(undefined), { canBeNull: true })).toBe(true);
    expect(ReqValid.validateNumber(bad(null), { canBeNull: false })).toBe(false);
    expect(ReqValid.validateNumber(bad(undefined), {})).toBe(false);
  });
});

describe('ReqValid.validateArray', () => {
  it('checks the number of elements (limits included)', () => {
    const req = { minElements: 1, maxElements: 2 };
    expect(ReqValid.validateArray([], req)).toBe(false);
    expect(ReqValid.validateArray([1], req)).toBe(true);
    expect(ReqValid.validateArray([1, 2], req)).toBe(true);
    expect(ReqValid.validateArray([1, 2, 3], req)).toBe(false);
  });

  it('treats maxElements: 0 as a real limit', () => {
    expect(ReqValid.validateArray([], { maxElements: 0 })).toBe(true);
    expect(ReqValid.validateArray([1], { maxElements: 0 })).toBe(false);
  });

  it('rejects values that are not arrays', () => {
    expect(ReqValid.validateArray(bad('abc'), { minElements: 1 })).toBe(false);
    expect(ReqValid.validateArray(bad({}), {})).toBe(false);
    expect(ReqValid.validateArray(bad({ length: 3 }), { minElements: 1 })).toBe(false);
  });

  it('null/undefined: depends on canBeNull and does not throw', () => {
    expect(ReqValid.validateArray(bad(null), { canBeNull: true })).toBe(true);
    expect(ReqValid.validateArray(bad(undefined), { canBeNull: true })).toBe(true);
    expect(ReqValid.validateArray(bad(null), { minElements: 1 })).toBe(false);
    expect(ReqValid.validateArray(bad(undefined), { minElements: 1 })).toBe(false);
  });
});

describe('ReqValid.validateDate', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-10-14T12:00:00Z'));
  });

  const adult = { minAge: 18, maxAge: 100 };

  it('on the 18th birthday the person is an adult', () => {
    expect(ReqValid.validateDate('2008-10-14', adult)).toBe(true);
  });

  it('the day before the 18th birthday the person is not an adult', () => {
    expect(ReqValid.validateDate('2008-10-15', adult)).toBe(false);
  });

  it('the day after the 18th birthday the person is an adult', () => {
    expect(ReqValid.validateDate('2008-10-13', adult)).toBe(true);
  });

  it('upper age limit: 100 years is fine, 101 is not', () => {
    expect(ReqValid.validateDate('1926-10-14', adult)).toBe(true); 
    expect(ReqValid.validateDate('1926-10-15', adult)).toBe(true); 
    expect(ReqValid.validateDate('1925-10-14', adult)).toBe(false);
  });

  it('rejects a date in the future', () => {
    expect(ReqValid.validateDate('2026-10-15', { minAge: 0, maxAge: 100 })).toBe(false);
    expect(ReqValid.validateDate('2030-01-01', { minAge: 0, maxAge: 100 })).toBe(false);
  });

  it('rejects invalid text, empty text and non-strings', () => {
    expect(ReqValid.validateDate('abc', adult)).toBe(false);
    expect(ReqValid.validateDate('', adult)).toBe(false);
    expect(ReqValid.validateDate('   ', adult)).toBe(false);
    expect(ReqValid.validateDate(bad(123), adult)).toBe(false);
    expect(ReqValid.validateDate(bad({}), adult)).toBe(false);
  });

  it('null/undefined: depends on canBeNull', () => {
    expect(ReqValid.validateDate(bad(null), { ...adult, canBeNull: true })).toBe(true);
    expect(ReqValid.validateDate(bad(undefined), { ...adult, canBeNull: true })).toBe(true);
    expect(ReqValid.validateDate(bad(null), { ...adult, canBeNull: false })).toBe(false);
    expect(ReqValid.validateDate(bad(undefined), adult)).toBe(false);
  });

  it('the result does not depend on the time of day (midnight boundary)', () => {
    vi.setSystemTime(new Date('2026-10-14T00:30:00Z'));
    expect(ReqValid.validateDate('2008-10-14', adult)).toBe(true);
    vi.setSystemTime(new Date('2026-10-13T23:30:00Z'));
    expect(ReqValid.validateDate('2008-10-14', adult)).toBe(false);
  });
});

describe('ReqValid.validateObject', () => {
  const registerLike = {
    email: { type: 'string', requirements: { minLength: 5, maxLength: 100, canBeNull: false } },
    age: { type: 'number', requirements: { min: 0, max: 150 } },
    tags: { type: 'array', requirements: { maxElements: 3 } },
    birthDate: { type: 'date', requirements: { minAge: 18, maxAge: 100 } },
  } as never;

  const validBody = () => ({
    email: 'jan@example.com',
    age: 30,
    tags: ['a'],
    birthDate: '1990-05-20',
  });

  it('accepts a valid object', () => {
    expect(ReqValid.validateObject(validBody(), registerLike)).toBe(true);
  });

  it('rejects an object that is missing a required field', () => {
    const body: Record<string, unknown> = validBody();
    delete body['email'];
    expect(ReqValid.validateObject(body, registerLike)).toBe(false);
  });

  it('rejects an object with a field of the wrong type', () => {
    expect(ReqValid.validateObject({ ...validBody(), age: '30' }, registerLike)).toBe(false);
    expect(ReqValid.validateObject({ ...validBody(), tags: 'a' }, registerLike)).toBe(false);
  });

  it('VALIDATES date fields (future dates and too-young ages are rejected)', () => {
    expect(ReqValid.validateObject({ ...validBody(), birthDate: '2999-01-01' }, registerLike)).toBe(false);
    expect(ReqValid.validateObject({ ...validBody(), birthDate: 'abc' }, registerLike)).toBe(false);
    const tooYoung = new Date();
    tooYoung.setUTCFullYear(tooYoung.getUTCFullYear() - 10);
    expect(
      ReqValid.validateObject({ ...validBody(), birthDate: tooYoung.toISOString().slice(0, 10) }, registerLike)
    ).toBe(false);
  });

  it('a field with canBeNull may be omitted', () => {
    const req = { nick: { type: 'string', requirements: { canBeNull: true } } } as never;
    expect(ReqValid.validateObject({}, req)).toBe(true);
    expect(ReqValid.validateObject({ nick: null }, req)).toBe(true);
  });

  it('rejects an unknown field type instead of treating it as valid', () => {
    const req = {
      first: { type: 'string', requirements: {} },
      second: { type: 'banana', requirements: {} },
    } as never;
    expect(ReqValid.validateObject({ first: 'x', second: 'y' }, req)).toBe(false);
  });

  it('an unknown type as the first field is rejected too', () => {
    const req = { first: { type: 'banana', requirements: {} } } as never;
    expect(ReqValid.validateObject({ first: 'x' }, req)).toBe(false);
  });

  it('rejects an empty entry in the configuration', () => {
    const req = { first: undefined } as never;
    expect(ReqValid.validateObject({ first: 'x' }, req)).toBe(false);
  });

  it('rejects input that is not an object', () => {
    expect(ReqValid.validateObject(bad(null), registerLike)).toBe(false);
    expect(ReqValid.validateObject(bad(undefined), registerLike)).toBe(false);
    expect(ReqValid.validateObject(bad('text'), registerLike)).toBe(false);
    expect(ReqValid.validateObject(bad(42), registerLike)).toBe(false);
  });

  it('empty requirements let any object through', () => {
    expect(ReqValid.validateObject({ anything: 1 }, {} as never)).toBe(true);
  });

  it('validates nested objects', () => {
    const req = {
      user: {
        type: 'object',
        requirements: { name: { type: 'string', requirements: { minLength: 2 } } },
      },
    } as never;
    expect(ReqValid.validateObject({ user: { name: 'Jan' } }, req)).toBe(true);
    expect(ReqValid.validateObject({ user: { name: 'J' } }, req)).toBe(false);
    expect(ReqValid.validateObject({ user: null }, req)).toBe(false);
    expect(ReqValid.validateObject({}, req)).toBe(false);
  });

  it('the log contains the field name but never its value (e.g. a password)', () => {
    const req = { password: { type: 'string', requirements: { minLength: 8 } } } as never;
    const secret = 'secretPass';
    expect(ReqValid.validateObject({ password: secret.slice(0, 3) }, req)).toBe(false);

    const logged = (console.error as unknown as ReturnType<typeof vi.fn>).mock.calls
      .flat()
      .join(' ');
    expect(logged).toContain('password');
    expect(logged).not.toContain(secret.slice(0, 3));
  });
});