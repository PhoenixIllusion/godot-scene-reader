export function getKeyByValue(enumObj: any, value: number): string | undefined {
  const keys = Object.keys(enumObj).filter(key => enumObj[key] === value);
  return keys.length > 0 ? keys[0] : undefined;
}