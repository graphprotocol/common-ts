import { mutable } from '../eventual'

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

  test('Filter (even and odd)', async () => {
    const source = mutable(0)
    const even = source.filter(value => value % 2 === 0)
    const odd = source.filter(value => value % 2 !== 0)

    await expect(source.value()).resolves.toStrictEqual(0)
    await expect(even.value()).resolves.toStrictEqual(0)
    // Note: we cannot check the value of `odd` here because it would block indefinitely

    for (let i = 1; i < 10; i++) {
      source.push(i)

      // Always expect the latest value in `source`, the most recent even value
      // in `even` and the most recent odd value in `odd`.
      await expect(source.value()).resolves.toStrictEqual(i)
      await expect(even.value()).resolves.toStrictEqual(i % 2 === 0 ? i : i - 1)
      await expect(odd.value()).resolves.toStrictEqual(i % 2 === 0 ? i - 1 : i)
    }
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
    lower.pipe(values => {
      piped.push(values)
    })

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

  test('Pipe (no race conditions)', async () => {
    const lower = mutable(['a', 'b', 'c'])
    let slowUpperRunning = false
    lower.pipe(async () => {
      expect(slowUpperRunning).toBeFalsy()
      slowUpperRunning = true
      await new Promise(resolve => setTimeout(resolve, 500)).then(() => {
        slowUpperRunning = false
      })
    })

    lower.push(['d'])
    lower.push(['e'])

    await expect(lower.value()).resolves.toStrictEqual(['e'])
    await new Promise(resolve => setTimeout(resolve, 1500))
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

  test('Reduce', async () => {
    const source = mutable(['a', 'b'])
    const reduced = source.reduce((s, values) => s + values.join(''), '')

    await expect(source.value()).resolves.toStrictEqual(['a', 'b'])
    await expect(reduced.value()).resolves.toStrictEqual('ab')

    source.push(['c', 'd'])

    await expect(source.value()).resolves.toStrictEqual(['c', 'd'])
    await expect(reduced.value()).resolves.toStrictEqual('abcd')

    source.push(['e'])

    await expect(source.value()).resolves.toStrictEqual(['e'])
    await expect(reduced.value()).resolves.toStrictEqual('abcde')
  })
})
