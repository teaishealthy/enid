export type IsExact<T, U> = [T] extends [U]
  ? [U] extends [T]
    ? true
    : false
  : false;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function assertType<T extends true | false>(_: T) {}
