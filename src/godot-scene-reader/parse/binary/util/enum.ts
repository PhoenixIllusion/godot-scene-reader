export type Enum<E> = Record<keyof E, number | string> & { [k: number]: string };
export function getKeyByValue<T extends Enum<T>>(enumObj: T, value: number): string & keyof T {
  return enumObj[value] as (string & keyof T);
}