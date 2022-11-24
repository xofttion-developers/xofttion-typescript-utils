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

  const firstValue = valueSplit.firstElement() as string;
  const lastValue = valueSplit.lastElement() as string;

  return `${firstValue.firstChar()}${lastValue.firstChar()}`.toUpperCase();
}
