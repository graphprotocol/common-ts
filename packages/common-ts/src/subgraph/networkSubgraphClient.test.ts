import nock from 'nock'
import gql from 'graphql-tag'
import { createNetworkSubgraphClient } from './networkSubgraphClient'

describe('Network Subgraph Client', () => {
  test('Sends queries to the configured URL', async () => {
    nock('http://foo.bar/')
      .post('/baz/ruux')
      .reply(200, { data: { ok: true } })

    const client = await createNetworkSubgraphClient({ url: 'http://foo.bar/baz/ruux' })

    expect(
      client
        .query(
          gql`
            {
              ok
            }
          `,
        )
        .toPromise(),
    ).resolves.toMatchObject({
      data: { ok: true },
    })

    expect(nock.isDone())
  })
})
