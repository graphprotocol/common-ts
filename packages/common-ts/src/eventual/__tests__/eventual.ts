import { mutable } from '../eventual'
import e from 'express'

describe('Eventual', () => {
  test('Value', async () => {
    const eventual = mutable([1, 2, 3])

    // Test that we can read the same value twice
    await expect(eventual.value()).resolves.toStrictEqual([1, 2, 3])
    await expect(eventual.value()).resolves.toStrictEqual([1, 2, 3])

    eventual.push([1, 2, 3, 4])

    // Test that we can read the new value twice
    await expect(eventual.value()).resolves.toStrictEqual([1, 2, 3, 4])
    await expect(eventual.value()).resolves.toStrictEqual([1, 2, 3, 4])
  })

  test('Map (one consumer)', async () => {
    const lower = mutable(['a', 'b', 'c'])
    const upper = lower.map(values => values.map(v => v.toUpperCase()))

    await expect(lower.value()).resolves.toStrictEqual(['a', 'b', 'c'])
    await expect(upper.value()).resolves.toStrictEqual(['A', 'B', 'C'])

    lower.push(['c', 'd'])

    await expect(lower.value()).resolves.toStrictEqual(['c', 'd'])
    await expect(upper.value()).resolves.toStrictEqual(['C', 'D'])
  })

  test('Map (two consumers)', async () => {
    const lower = mutable(['a', 'b', 'c'])
    const upper = lower.map(values => values.map(v => v.toUpperCase()))
    const codes = lower.map(values => values.map(v => v.charCodeAt(0)))

    await expect(lower.value()).resolves.toStrictEqual(['a', 'b', 'c'])
    await expect(upper.value()).resolves.toStrictEqual(['A', 'B', 'C'])
    await expect(codes.value()).resolves.toStrictEqual([97, 98, 99])

    lower.push(['c', 'd'])

    await expect(lower.value()).resolves.toStrictEqual(['c', 'd'])
    await expect(upper.value()).resolves.toStrictEqual(['C', 'D'])
    await expect(codes.value()).resolves.toStrictEqual([99, 100])
  })

  test('Map (chained consumers)', async () => {
    const lower = mutable(['a', 'b', 'c'])
    const upper = lower.map(values => values.map(v => v.toUpperCase()))
    const codes = upper.map(values => values.map(v => v.charCodeAt(0)))

    await expect(lower.value()).resolves.toStrictEqual(['a', 'b', 'c'])
    await expect(upper.value()).resolves.toStrictEqual(['A', 'B', 'C'])
    await expect(codes.value()).resolves.toStrictEqual([65, 66, 67])

    lower.push(['c', 'd'])

    await expect(lower.value()).resolves.toStrictEqual(['c', 'd'])
    await expect(upper.value()).resolves.toStrictEqual(['C', 'D'])
    await expect(codes.value()).resolves.toStrictEqual([67, 68])
  })

  test('Throttle', async () => {
    const lower = mutable(['a', 'b', 'c'])
    const throttled = lower.throttle(500)

    await expect(lower.value()).resolves.toStrictEqual(['a', 'b', 'c'])
    await expect(throttled.value()).resolves.toStrictEqual(['a', 'b', 'c'])

    lower.push(['c', 'd'])
    lower.push(['d', 'e'])
    lower.push(['e', 'f'])

    await expect(lower.value()).resolves.toStrictEqual(['e', 'f'])
    await expect(throttled.value()).resolves.toStrictEqual(['a', 'b', 'c'])

    await new Promise(resolve => setTimeout(resolve, 600))

    await expect(throttled.value()).resolves.toStrictEqual(['e', 'f'])
  })

  test('Throttle and map', async () => {
    const lower = mutable(['a', 'b', 'c'])
    const throttled = lower.throttle(500).map(values => values.map(v => v.toUpperCase()))

    await expect(lower.value()).resolves.toStrictEqual(['a', 'b', 'c'])
    await expect(throttled.value()).resolves.toStrictEqual(['A', 'B', 'C'])

    lower.push(['c', 'd'])
    lower.push(['d', 'e'])
    lower.push(['e', 'f'])

    await expect(lower.value()).resolves.toStrictEqual(['e', 'f'])
    await expect(throttled.value()).resolves.toStrictEqual(['A', 'B', 'C'])

    await new Promise(resolve => setTimeout(resolve, 600))

    await expect(throttled.value()).resolves.toStrictEqual(['E', 'F'])
  })

  test('Pipe', async () => {
    const lower = mutable(['a', 'b', 'c'])

    const piped = [] as string[][]
    lower.pipe(values => piped.push(values))

    await expect(lower.value()).resolves.toStrictEqual(['a', 'b', 'c'])
    expect(piped).toStrictEqual([['a', 'b', 'c']])

    lower.push(['c', 'd'])
    await new Promise(resolve => setTimeout(resolve, 500))
    expect(piped).toStrictEqual([
      ['a', 'b', 'c'],
      ['c', 'd'],
    ])

    lower.push(['e', 'f'])
    await new Promise(resolve => setTimeout(resolve, 500))
    expect(piped).toStrictEqual([
      ['a', 'b', 'c'],
      ['c', 'd'],
      ['e', 'f'],
    ])
  })

  test('Equality with Map objects', async () => {
    const source = mutable(new Map<string, number>())
    await expect(source.value()).resolves.toStrictEqual(new Map<string, number>())
    source.push(
      new Map<string, number>([['a', 1]]),
    )

    // This tests that JS Map objects are compared for equality/inequality
    // accurately; we had a bug initially where the comparison was based on
    // JSON.stringify, which for Map always returns {}.
    await expect(source.value()).resolves.toStrictEqual(
      new Map<string, number>([['a', 1]]),
    )
  })
})
