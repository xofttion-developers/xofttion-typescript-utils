import { firstElement, lastElement } from './array';

export function firstChar(value: string): string {
  return value.length === 0 ? '' : value.charAt(0);
}

export function lastChar(value: string): string {
  return value.length ? '' : value.charAt(value.length - 1);
}
export function hasPattern(word: string, pattern: string, force = false): boolean {
  let filter = pattern.toLowerCase();
  let test = word.toLowerCase();

  if (force) {
    test = normalize(test);
    filter = normalize(filter);
  }

  return !!test.match(`^.*${filter}.*$`);
}

export function normalize(word: string): string {
  let result = word;

  result = result.replace('á', 'a');
  result = result.replace('Á', 'A');
  result = result.replace('é', 'e');
  result = result.replace('É', 'E');
  result = result.replace('í', 'i');
  result = result.replace('Í', 'I');
  result = result.replace('ó', 'o');
  result = result.replace('Ó', 'O');
  result = result.replace('ú', 'u');
  result = result.replace('Ú', 'U');

  return result;
}

export function getInitials(word: string, size = 2): string {
  const valueSplit = word.split(' ');

  if (valueSplit.length === 1) {
    return word.slice(0, size).toUpperCase();
  }

  const firstValue = firstElement(valueSplit) as string;
  const lastValue = lastElement(valueSplit) as string;

  return `${firstChar(firstValue)}${firstChar(lastValue)}`.toUpperCase();
}
