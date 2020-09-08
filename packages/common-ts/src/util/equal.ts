// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
export const equal = (a: any, b: any) =>
  a === b || JSON.stringify(a) === JSON.stringify(b)
