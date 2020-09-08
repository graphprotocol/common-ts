import { equal } from './equal'

function uniqueFilter<T>(value: T, index: number, array: T[]): boolean {
  return array.findIndex(v => equal(value, v)) === index
}

export function uniqueValues<T>(array: T[]): T[] {
  return array.filter(uniqueFilter)
}
