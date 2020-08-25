/* eslint-disable @typescript-eslint/ban-types */

import { IndexerManagementResolverContext } from '../client'
import geohash, { GeographicPoint } from 'ngeohash'
import url from 'url'

class IndexerEndpoint {
  url: string | null
  healthy: boolean

  constructor(url: string | null, healthy: boolean) {
    this.url = url
    this.healthy = healthy
  }
}

export default {
  indexerRegistration: async (
    _: {},
    { address, contracts }: IndexerManagementResolverContext,
  ): Promise<object | null> => {
    const registered = await contracts.serviceRegistry.registered(address)
    let url: string | null = null
    let location: GeographicPoint | null = null

    if (registered) {
      const service = await contracts.serviceRegistry.services(address)
      url = service.url
      location = geohash.decode(service.geohash)
    }

    return {
      url,
      address,
      registered,
      location,
      __typename: 'IndexerRegistration',
    }
  },
  indexerEndpoints: async (
    _: {},
    { address, contracts }: IndexerManagementResolverContext,
  ): Promise<object | null> => {
    const service = await contracts.serviceRegistry.services(address)

    const serviceEndpoint = new IndexerEndpoint(null, false)
    const channelsEndpoint = new IndexerEndpoint(null, false)
    const statusEndpoint = new IndexerEndpoint(null, false)

    if (service) {
      serviceEndpoint.url = service.url
      const serviceResponse = await fetch(serviceEndpoint.url)
      serviceEndpoint.healthy = serviceResponse.ok

      channelsEndpoint.url = url.resolve(service.url, '/subgraph/id/qmTestSubgraph')
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const channelResult = await fetch(channelsEndpoint.url!)
      channelsEndpoint.healthy = channelResult.ok

      statusEndpoint.url = url.resolve(service.url, '/status')
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const statusResult = await fetch(statusEndpoint.url!)
      statusEndpoint.healthy = statusResult.ok
    }

    return {
      serviceEndpoint,
      statusEndpoint,
      channelsEndpoint,
    }
  },
}
