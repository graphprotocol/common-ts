import { join, mutable, timer, WritableEventual } from '../eventual'

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

  test('Try map', async () => {
    const numbers: WritableEventual<number> = mutable()
    const errors: string[] = []
    const onError = (err: string) => errors.push(err)

    const evenNumbersOnly = numbers.tryMap(
      n => {
        if (n % 2 === 0) {
          return n
        } else {
          throw `${n} is odd`
        }
      },
      { onError },
    )

    for (let i = 0; i < 10; i++) {
      numbers.push(i)
      await expect(numbers.value()).resolves.toStrictEqual(i)
      await expect(evenNumbersOnly.value()).resolves.toStrictEqual(
        i % 2 === 0 ? i : i - 1,
      )
    }

    expect(errors).toStrictEqual([
      `1 is odd`,
      `3 is odd`,
      `5 is odd`,
      `7 is odd`,
      `9 is odd`,
    ])
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
    const source = mutable(new Map([['y', 'x']]))
    await expect(source.value()).resolves.toStrictEqual(
      new Map<string, string>([['y', 'x']]),
    )
    source.push(new Map([['x', 'y']]))

    // This tests that JS Map objects are compared for equality/inequality
    // accurately; we had a bug initially where the comparison was based on
    // JSON.stringify, which for Map always returns {}.
    await expect(source.value()).resolves.toStrictEqual(
      new Map<string, string>([['x', 'y']]),
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

  test('Join (all values ready)', async () => {
    const letters = mutable(['a', 'b'])
    const numbers = mutable([1, 2])
    const joined = join({ letters, numbers })

    await expect(joined.value()).resolves.toStrictEqual({
      letters: ['a', 'b'],
      numbers: [1, 2],
    })
  })

  test('Join (not all values ready initally)', async () => {
    const letters = mutable(['a', 'b'])
    const numbers = mutable([1, 2])
    const delayed = mutable()
    const joined = join({ letters, numbers, delayed })

    setTimeout(() => delayed.push('ready now'), 500)

    await expect(joined.value()).resolves.toStrictEqual({
      letters: ['a', 'b'],
      numbers: [1, 2],
      delayed: 'ready now',
    })
  })

  test('Join (multiple updates)', async () => {
    const letters = mutable(['a', 'b'])
    const numbers = mutable([1, 2])
    const delayed = mutable()

    const joined = join({ letters, numbers, delayed })

    setTimeout(() => delayed.push('ready now'), 500)

    // Update letters again before the delayed eventual has a value; this should
    // not update the join result before the delayed eventual is ready
    letters.push(['c', 'd'])

    await expect(joined.value()).resolves.toStrictEqual({
      letters: ['c', 'd'],
      numbers: [1, 2],
      delayed: 'ready now',
    })

    // Update letters again after the delayed eventual has a value; this should
    // update the join result as in any regular case
    letters.push(['e', 'f'])

    await expect(joined.value()).resolves.toStrictEqual({
      letters: ['e', 'f'],
      numbers: [1, 2],
      delayed: 'ready now',
    })
  })

  test('Join (timer)', async () => {
    const ticker = timer(100)
    const ticks = ticker.reduce(n => ++n, 0)
    const ticksViaJoin = join({ ticker }).reduce(n => ++n, 0)

    await new Promise(resolve => setTimeout(resolve, 1000))

    // We should have seen 9-10 timer events, but as long as we've seen a few
    // we're happy
    await expect(ticks.value()).resolves.toBeGreaterThan(5)
    await expect(ticksViaJoin.value()).resolves.toBeGreaterThan(5)
  })
})
