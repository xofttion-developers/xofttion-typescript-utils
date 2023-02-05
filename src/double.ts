type DoubleProps = {
  decimals: number[];
  exp: number;
  signed: number;
};

type DoubleValue = string | number | Double | DoubleProps;

const DOUBLE_REGEX = /^(\d+(\.\d*)?|\.\d+)(e[+-]?\d+)?$/i;
const BASE = 1e5;
const LOG_BASE = 5;
const EXPONENT_NEGATIVE = -5;
const EXPONENT_POSITIVE = 15;
const MAX_SAFE_INTEGER = 9007199254740991;
const MAX_EXPONENT = Math.floor(MAX_SAFE_INTEGER / LOG_BASE);
const CHAR_NEGATIVE = 45;
const CHAR_ZERO = 48;
const DOUBLE_ZERO_PROPS = { decimals: [0], exp: 0, signed: 0 };
const PRECISION = 20;
const SIGNED_POSITIVE = 1;
const SIGNED_NEGATIVE = -1;

export class Double {
  public readonly decimals;
  public readonly exp;
  public readonly signed;

  constructor(value: DoubleValue) {
    const { decimals, exp, signed } = createDoubleProps(value);

    this.decimals = decimals;
    this.exp = exp;
    this.signed = signed;
  }

  public plus(value: DoubleValue): Double {
    const double = createDouble(value);

    return this.signed == double.signed
      ? plus(this, double)
      : minus(this, double.negative());
  }

  public minus(value: DoubleValue): Double {
    const double = createDouble(value);

    return this.signed == double.signed
      ? minus(this, double)
      : plus(this, double.negative());
  }

  public multiply(value: DoubleValue): Double {
    return multiply(this, createDouble(value));
  }

  public divide(value: DoubleValue): Double {
    return divide(this, createDouble(value));
  }

  public abs(): Double {
    return new Double({
      decimals: this.decimals,
      exp: this.exp,
      signed: SIGNED_POSITIVE
    });
  }

  public negative(): Double {
    return new Double({
      decimals: this.decimals,
      exp: this.exp,
      signed: -this.signed
    });
  }

  public equals(value: DoubleValue): boolean {
    const double = createDouble(value);

    if (this.signed !== double.signed || this.exp !== double.exp) {
      return false;
    }

    if (this.decimals.length !== double.decimals.length) {
      return false;
    }

    for (let i = 0; i < length; ++i) {
      if (this.decimals[i] !== double.decimals[i]) {
        return false;
      }
    }

    return true;
  }

  public get value(): number {
    return +this;
  }

  public isZero(): boolean {
    return this.signed === 0;
  }

  public clone(): Double {
    return new Double(this.props());
  }

  public props(): DoubleProps {
    return { decimals: [...this.decimals], exp: this.exp, signed: this.signed };
  }

  public toString(): string {
    return toString(this, isExponent(getExpBase10(this)));
  }

  public static zero(): Double {
    return new Double(DOUBLE_ZERO_PROPS);
  }
}

function createDouble(value: DoubleValue): Double {
  return value instanceof Double ? value : new Double(value);
}

function createDoubleProps(value: DoubleValue): DoubleProps {
  if (value instanceof Double) {
    return value.props();
  }

  if (typeof value === 'number') {
    return createDoubleFromNumber(value);
  }

  if (typeof value === 'string') {
    return createDoubleFromString(value);
  }

  return value;
}

function createDoubleFromNumber(value: number): DoubleProps {
  if (value * 0 !== 0) {
    throw Error('[DecimalError] Invalid argument: ' + value);
  }

  if (value === 0) {
    return DOUBLE_ZERO_PROPS;
  }

  let signed = SIGNED_POSITIVE;

  if (value < 0) {
    value = -value;
    signed = SIGNED_NEGATIVE;
  }

  return parseDouble(signed, value.toString());
}

function createDoubleFromString(value: string): DoubleProps {
  let signed = SIGNED_POSITIVE;

  if (value.charCodeAt(0) === CHAR_NEGATIVE) {
    value = value.slice(1);
    signed = SIGNED_NEGATIVE;
  }

  if (!DOUBLE_REGEX.test(value)) {
    throw Error('[DecimalError] Invalid argument: ' + value);
  }

  return parseDouble(signed, value);
}

function parseDouble(signed: number, doubleStr: string): DoubleProps {
  let expStr = doubleStr.indexOf('.');
  let i = doubleStr.search(/e/i);
  let length = doubleStr.length;

  if (expStr > -1) {
    doubleStr = doubleStr.replace('.', '');
  }

  if (i > 0) {
    if (expStr < 0) {
      expStr = i;
    }

    expStr += +doubleStr.slice(i + 1);
    doubleStr = doubleStr.substring(0, i);
  } else if (expStr < 0) {
    expStr = doubleStr.length;
  }

  for (i = 0; doubleStr.charCodeAt(i) === CHAR_ZERO; ) {
    ++i;
  }

  for (length; doubleStr.charCodeAt(length - 1) === CHAR_ZERO; ) {
    --length;
  }

  doubleStr = doubleStr.slice(i, length);

  if (doubleStr) {
    expStr = expStr - i - 1;
    length -= i;

    let exp = Math.floor(expStr / LOG_BASE);
    const decimals = [];

    i = (expStr + 1) % LOG_BASE;

    if (expStr < 0) {
      i += LOG_BASE;
    }

    if (i < length) {
      if (i) {
        decimals.push(+doubleStr.slice(0, i));
      }

      for (length -= LOG_BASE; i < length; ) {
        decimals.push(+doubleStr.slice(i, (i += LOG_BASE)));
      }

      doubleStr = doubleStr.slice(i);
      i = LOG_BASE - doubleStr.length;
    } else {
      i -= exp === 0 ? length : length - 1;
    }

    for (; i--; ) {
      doubleStr += '0';
    }

    decimals.push(+doubleStr);

    if (exp > MAX_EXPONENT || exp < -MAX_EXPONENT) {
      throw Error('Exponent out of range: ' + expStr);
    }

    return { decimals, exp, signed };
  } else {
    return DOUBLE_ZERO_PROPS;
  }
}

function plus(number1: Double, number2: Double): Double {
  if (number1.isZero() && number2.isZero()) {
    return Double.zero();
  }

  let carry = 0;
  let decimalsTemp;
  let length;

  let decimals1 = [...number1.decimals].slice();
  let decimals2 = [...number2.decimals];

  let exp1 = number1.exp;
  let exp2 = number2.exp;
  let expDiff = exp1 - exp2;

  if (expDiff) {
    if (expDiff < 0) {
      decimalsTemp = decimals1;
      expDiff = -expDiff;
      length = decimals2.length;
    } else {
      decimalsTemp = decimals2;
      exp2 = exp1;
      length = decimals1.length;
    }

    exp1 = Math.ceil(PRECISION / LOG_BASE);
    length = exp1 > length ? exp1 + 1 : length + 1;

    if (expDiff > length) {
      expDiff = length;
      decimalsTemp.length = 1;
    }

    decimalsTemp.reverse();

    for (; expDiff--; ) {
      decimalsTemp.push(0);
    }

    decimalsTemp.reverse();
  }

  length = decimals1.length;
  expDiff = decimals2.length;

  if (length - expDiff < 0) {
    expDiff = length;
    decimalsTemp = decimals2;
    decimals2 = decimals1;
    decimals1 = decimalsTemp;
  }

  for (; expDiff; ) {
    carry =
      ((decimals1[--expDiff] = decimals1[expDiff] + decimals2[expDiff] + carry) /
        BASE) |
      0;
    decimals1[expDiff] %= BASE;
  }

  if (carry) {
    decimals1.unshift(carry);
    ++exp2;
  }

  for (length = decimals1.length; decimals1[--length] == 0; ) {
    decimals1.pop();
  }

  return new Double({ decimals: decimals1, exp: exp2, signed: number1.signed });
}

function minus(number1: Double, number2: Double): Double {
  if (number1.isZero() && number2.isZero()) {
    return Double.zero();
  }

  let decimalsTemp, index1, index2, length, verify;

  let decimals1 = [...number1.decimals].slice();
  let decimals2 = [...number2.decimals];

  let signed = number2.signed;
  let exp1 = number1.exp;
  let exp2 = number2.exp;
  let expDiff = exp1 - exp2;

  if (expDiff) {
    verify = expDiff < 0;

    if (verify) {
      decimalsTemp = decimals1;
      expDiff = -expDiff;
      length = decimals2.length;
    } else {
      decimalsTemp = decimals2;
      exp2 = exp1;
      length = decimals1.length;
    }

    index1 = Math.max(Math.ceil(PRECISION / LOG_BASE), length) + 2;

    if (expDiff > index1) {
      expDiff = index1;
      decimalsTemp.length = 1;
    }

    decimalsTemp.reverse();

    for (index1 = expDiff; index1--; ) {
      decimalsTemp.push(0);
    }

    decimalsTemp.reverse();
  } else {
    length = decimals2.length;
    index1 = decimals1.length;
    verify = index1 < length;

    if (verify) {
      length = index1;
    }

    for (index1 = 0; index1 < length; index1++) {
      if (decimals1[index1] != decimals2[index1]) {
        verify = decimals1[index1] < decimals2[index1];
        break;
      }
    }

    expDiff = 0;
  }

  if (verify) {
    decimalsTemp = decimals1;
    decimals1 = decimals2;
    decimals2 = decimalsTemp;
    signed = -signed;
  }

  length = decimals1.length;

  for (index1 = decimals2.length - length; index1 > 0; --index1) {
    decimals1[length++] = 0;
  }

  for (index1 = decimals2.length; index1 > expDiff; ) {
    if (decimals1[--index1] < decimals2[index1]) {
      for (index2 = index1; index2 && decimals1[--index2] === 0; ) {
        decimals1[index2] = BASE - 1;
      }

      --decimals1[index2];
      decimals1[index1] += BASE;
    }

    decimals1[index1] -= decimals2[index1];
  }

  for (; decimals1[--length] === 0; ) {
    decimals1.pop();
  }

  for (; decimals1[0] === 0; decimals1.shift()) {
    --exp2;
  }

  if (!decimals1[0]) {
    return Double.zero();
  }

  return new Double({ decimals: decimals1, exp: exp2, signed });
}

function multiply(number1: Double, number2: Double): Double {
  if (number1.isZero() && number2.isZero()) {
    return Double.zero();
  }

  const signed = number1.signed * number2.signed;

  let index1, lengthTemp;
  let exp = number1.exp + number2.exp;
  let decimals1 = [...number1.decimals];
  let decimals2 = [...number2.decimals];
  let decimalsTemp = [];
  let length1 = decimals1.length;
  let length2 = decimals2.length;

  if (length1 < length2) {
    decimalsTemp = decimals1;
    decimals1 = decimals2;
    decimals2 = decimalsTemp;
    lengthTemp = length1;
    length1 = length2;
    length2 = lengthTemp;
  }

  decimalsTemp = [];
  lengthTemp = length1 + length2;

  for (index1 = lengthTemp; index1--; ) {
    decimalsTemp.push(0);
  }

  let carry, index2;

  for (index1 = length2; --index1 >= 0; ) {
    carry = 0;

    for (index2 = length1 + index1; index2 > index1; ) {
      const th: number =
        decimalsTemp[index2] +
        decimals2[index1] * decimals1[index2 - index1 - 1] +
        carry;

      decimalsTemp[index2--] = th % BASE | 0;

      carry = (th / BASE) | 0;
    }

    decimalsTemp[index2] = (decimalsTemp[index2] + carry) % BASE | 0;
  }

  for (; !decimalsTemp[--lengthTemp]; ) decimalsTemp.pop();

  if (carry) {
    ++exp;
  } else {
    decimalsTemp.shift();
  }

  return new Double({ decimals: decimalsTemp, exp: exp, signed });
}

function divide(
  number1: Double,
  number2: Double,
  precision?: number,
  dp?: any
): Double {
  if (number2.isZero()) {
    throw Error('[DecimalError] Division by zero');
  }

  if (number1.isZero()) {
    return Double.zero();
  }
  const signed =
    number1.signed == number2.signed ? SIGNED_POSITIVE : SIGNED_NEGATIVE;

  let index1, index2, precTemp;
  let decimals1 = [...number1.decimals];
  let decimals2 = [...number2.decimals];
  let decimals: number[] = [];

  let length1 = number1.decimals.length;
  let length2 = number2.decimals.length;
  let exp = number1.exp - number2.exp;

  for (index1 = 0; decimals2[index1] == (decimals1[index1] || 0); ) {
    ++index1;
  }

  if (decimals2[index1] > (decimals1[index1] || 0)) {
    --exp;
  }

  if (!precision) {
    precTemp = precision = PRECISION;
  } else if (dp) {
    precTemp = precision + (getExpBase10(number1) - getExpBase10(number2)) + 1;
  } else {
    precTemp = precision;
  }

  if (precTemp < 0) {
    return Double.zero();
  }

  precTemp = (precTemp / LOG_BASE + 2) | 0;
  index1 = 0;

  if (length2 == 1) {
    const first2 = decimals2[0];
    index2 = 0;
    precTemp++;

    for (; (index1 < length1 || index2) && precTemp--; index1++) {
      const size: number = index2 * BASE + (decimals1[index1] || 0);

      decimals[index1] = (size / first2) | 0;
      index2 = size % first2 | 0;
    }
  } else {
    index2 = (BASE / (decimals2[0] + 1)) | 0;

    if (index2 > 1) {
      decimals2 = multiplyInteger(decimals2, index2);
      decimals1 = multiplyInteger(decimals1, index2);
      length2 = decimals2.length;
      length1 = decimals1.length;
    }

    let lengthTemp = length2;
    let redimDecimals = decimals1.slice(0, length2);
    let redimLength = redimDecimals.length;

    for (; redimLength < length2; ) {
      redimDecimals[redimLength++] = 0;
    }

    let resetDecimals = decimals2.slice();
    resetDecimals.unshift(0);
    let first2 = decimals2[0];

    if (number2.decimals[1] >= BASE / 2) {
      ++first2;
    }

    do {
      index2 = 0;
      let result = compare(number2.decimals, redimDecimals, length2, redimLength);

      if (result < 0) {
        let redimFirst = redimDecimals[0];

        if (length2 != redimLength) {
          redimFirst = redimFirst * BASE + (redimDecimals[1] || 0);
        }

        index2 = (redimFirst / first2) | 0;

        let multuply2, lengthMultiply;

        if (index2 > 1) {
          if (index2 >= BASE) {
            index2 = BASE - 1;
          }

          multuply2 = multiplyInteger(decimals2, index2);
          lengthMultiply = multuply2.length;
          redimLength = redimDecimals.length;

          result = compare(multuply2, redimDecimals, lengthMultiply, redimLength);

          if (result == 1) {
            index2--;

            subtract(
              multuply2,
              length2 < lengthMultiply ? resetDecimals : decimals2,
              lengthMultiply
            );
          }
        } else {
          if (index2 == 0) result = index2 = 1;
          multuply2 = decimals2.slice();
        }

        lengthMultiply = multuply2.length;

        if (lengthMultiply < redimLength) {
          multuply2.unshift(0);
        }

        subtract(redimDecimals, multuply2, redimLength);

        if (result == -1) {
          redimLength = redimDecimals.length;
          result = compare(decimals2, redimDecimals, length2, redimLength);

          if (result < 1) {
            index2++;
            subtract(
              redimDecimals,
              length2 < redimLength ? resetDecimals : decimals2,
              redimLength
            );
          }
        }

        redimLength = redimDecimals.length;
      } else if (result === 0) {
        index2++;
        redimDecimals = [0];
      }

      decimals[index1++] = index2;

      if (result && redimDecimals[0]) {
        redimDecimals[redimLength++] = decimals1[lengthTemp] || 0;
      } else {
        redimDecimals = [decimals1[lengthTemp]];
        redimLength = 1;
      }
    } while ((lengthTemp++ < length1 || redimDecimals[0] !== void 0) && precTemp--);
  }

  if (!decimals[0]) {
    decimals.shift();
  }

  const double = new Double({ decimals, exp, signed });

  const precisionDef = dp ? precision + getExpBase10(double) + 1 : precision;

  return round(double, precisionDef);
}

function multiplyInteger(decimals: number[], size: number): number[] {
  let i = decimals.length;
  let carry = 0;
  let temp;

  for (decimals = decimals.slice(); i--; ) {
    temp = decimals[i] * size + carry;
    decimals[i] = temp % BASE | 0;
    carry = (temp / BASE) | 0;
  }

  if (carry) {
    decimals.unshift(carry);
  }

  return decimals;
}

function compare(
  decimals1: number[],
  decimals2: number[],
  length1: number,
  length2: number
): number {
  if (length1 != length2) {
    return length1 > length2 ? 1 : -1;
  }

  let result = 0;
  let i = 0;

  for (; i < length1; i++) {
    if (decimals1[i] != decimals2[i]) {
      result = decimals1[i] > decimals2[i] ? 1 : -1;
      break;
    }
  }

  return result;
}

function subtract(numbers1: number[], numbers2: number[], length: number): void {
  for (let i = 0; length--; ) {
    numbers1[length] -= i;
    i = numbers1[length] < numbers2[length] ? 1 : 0;
    numbers1[length] = i * BASE + numbers1[length] - numbers2[length];
  }

  for (; !numbers1[0] && numbers1.length > 1; ) {
    numbers1.shift();
  }
}

function round(double: Double, precisionDef: number, rm?: any): Double {
  const decimals = [...double.decimals];
  let numberDigits = 1;

  for (let first = decimals[0]; first >= 10; first /= 10) {
    numberDigits++;
  }

  let length = precisionDef - numberDigits;
  let presicion;
  let roundNumber = decimals[0];
  let index = 0;

  if (length < 0) {
    presicion = precisionDef;
    length += LOG_BASE;
  } else {
    index = Math.ceil((length + 1) / LOG_BASE);

    if (index >= decimals.length) {
      return double.clone();
    }

    let word = (roundNumber = decimals[index]);

    for (numberDigits = 1; word >= 10; word /= 10) {
      numberDigits++;
    }

    length %= LOG_BASE;
    presicion = length - LOG_BASE + numberDigits;
  }

  let doRound;

  if (rm) {
    const pow = Math.pow(10, numberDigits - presicion - 1);

    let roundDigit = (roundNumber / pow) % 10 | 0;

    doRound =
      precisionDef < 0 || decimals[index + 1] !== void 0 || roundNumber % pow;

    doRound =
      rm < 4
        ? (roundDigit || doRound) && (rm == 0 || rm == (double.signed < 0 ? 3 : 2))
        : roundDigit > 5 ||
          (roundDigit == 5 &&
            (rm == 4 ||
              doRound ||
              (rm == 6 &&
                (length > 0
                  ? presicion > 0
                    ? roundNumber / Math.pow(10, numberDigits - presicion)
                    : 0
                  : decimals[index - 1]) %
                  10 &
                  1) ||
              rm == (double.signed < 0 ? 8 : 7)));
  }

  if (precisionDef < 1 || !decimals[0]) {
    if (doRound) {
      const exp10 = getExpBase10(double);

      precisionDef = precisionDef - exp10 - 1;

      const value = Math.pow(10, (LOG_BASE - (precisionDef % LOG_BASE)) % LOG_BASE);
      const exp = Math.floor(-precisionDef / LOG_BASE) || 0;

      return new Double({ decimals: [value], exp, signed: double.signed });
    } else {
      return Double.zero();
    }
  }

  let size = Math.pow(10, LOG_BASE - length);
  let exp = double.exp;
  let signed = double.signed;

  if (length == 0) {
    decimals.length = index;
    size = 1;
    index--;
  } else {
    decimals.length = index + 1;

    decimals[index] =
      presicion > 0
        ? ((roundNumber / Math.pow(10, numberDigits - presicion)) %
            Math.pow(10, presicion) |
            0) *
          size
        : 0;
  }

  if (doRound) {
    for (;;) {
      if (index == 0) {
        if ((decimals[0] += size) == BASE) {
          decimals[0] = 1;
          ++exp;
        }

        break;
      } else {
        decimals[index] += size;

        if (decimals[index] != BASE) {
          break;
        }

        decimals[index--] = 0;
        size = 1;
      }
    }
  }

  for (length = decimals.length; decimals[--length] === 0; ) {
    decimals.pop();
  }

  if (double.exp > MAX_EXPONENT || double.exp < -MAX_EXPONENT) {
    throw Error('[DecimalError] Exponent out of range: ' + getExpBase10(double));
  }

  return new Double({ decimals, exp, signed });
}

function toString(double: Double, isExponent: boolean, sd?: number): string {
  let digits = digitsToString(double.decimals);
  let length = digits.length;
  let exp = getExpBase10(double);
  let countZero;

  if (isExponent) {
    if (sd && (countZero = sd - length) > 0) {
      digits = digits.charAt(0) + '.' + digits.slice(1) + padZeroString(countZero);
    } else if (length > 1) {
      digits = digits.charAt(0) + '.' + digits.slice(1);
    }

    digits = digits + (exp < 0 ? 'e' : 'e+') + exp;
  } else if (exp < 0) {
    digits = '0.' + padZeroString(-exp - 1) + digits;

    if (sd && (countZero = sd - length) > 0) {
      digits += padZeroString(countZero);
    }
  } else if (exp >= length) {
    digits += padZeroString(exp + 1 - length);

    if (sd && (countZero = sd - exp - 1) > 0) {
      digits = digits + '.' + padZeroString(countZero);
    }
  } else {
    if ((countZero = exp + 1) < length) {
      digits = digits.slice(0, countZero) + '.' + digits.slice(countZero);
    }

    if (sd && (countZero = sd - length) > 0) {
      if (exp + 1 === length) {
        digits += '.';
      }

      digits += padZeroString(countZero);
    }
  }

  return double.signed < 0 ? '-' + digits : digits;
}

function isExponent(exponent: number): boolean {
  return exponent <= EXPONENT_NEGATIVE || exponent >= EXPONENT_POSITIVE;
}

function getExpBase10(double: Double): number {
  let exp = double.exp * LOG_BASE;
  let dec = double.decimals[0];

  for (; dec >= 10; dec /= 10) {
    exp++;
  }

  return exp;
}

function digitsToString(decimals: number[]): string {
  let indexLastWord = decimals.length - 1;
  let str = '';
  let word = decimals[0];

  if (indexLastWord > 0) {
    let i = 1;
    let countZero;
    str += word;

    for (; i < indexLastWord; i++) {
      const numberString = decimals[i].toString();
      countZero = LOG_BASE - numberString.length;

      if (countZero) {
        str += padZeroString(countZero);
      }

      str += numberString;
    }

    word = decimals[i];
    countZero = LOG_BASE - word.toString().length;

    if (countZero) {
      str += padZeroString(countZero);
    }
  } else if (word === 0) {
    return '0';
  }

  for (; word % 10 === 0; ) {
    word /= 10;
  }

  return str + word;
}

function padZeroString(size: number): string {
  let zeroString = '';

  for (; size--; ) {
    zeroString += '0';
  }

  return zeroString;
}
