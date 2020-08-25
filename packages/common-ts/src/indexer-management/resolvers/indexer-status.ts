/* eslint-disable @typescript-eslint/ban-types */

import { IndexerManagementResolverContext } from '../client'
import geohash from 'ngeohash'

export default {
  indexerRegistration: async (
    _: {},
    { address, contracts }: IndexerManagementResolverContext,
  ): Promise<object | null> => {
    const registered = await contracts.serviceRegistry.isRegistered(address)

    if (registered) {
      const service = await contracts.serviceRegistry.services(address)
      return {
        address,
        url: service.url,
        location: geohash.decode(service.geohash),
        registered,
        __typename: 'IndexerRegistration',
      }
    } else {
      return {
        address,
        url: null,
        registered,
        location: null,
        __typename: 'IndexerRegistration',
      }
    }
  },

  indexerEndpoints: async (
    _: {},
    { address, contracts }: IndexerManagementResolverContext,
  ): Promise<object | null> => {
    const endpoints = {
      service: {
        url: null as string | null,
        healthy: false,
      },
      status: {
        url: null as string | null,
        healthy: false,
      },
      channels: {
        url: null as string | null,
        healthy: false,
      },
    }

    try {
      const service = await contracts.serviceRegistry.services(address)

      if (service) {
        let response = await fetch(service.url)
        endpoints.service.url = service.url
        endpoints.service.healthy = response.ok

        endpoints.status.url = new URL('/status', service.url).toString()
        response = await fetch('http://localhost:7600/status', {
          method: 'POST',
          headers: { 'content-type': 'application/json/' },
          body: JSON.stringify({ query: '{ indexingStatuses { subgraph } }' }),
        })
        endpoints.status.healthy = response.ok

        endpoints.channels.url = new URL(
          '/channel-messages-inbox',
          service.url,
        ).toString()
        response = await fetch('http://localhost:7600/channel-messages-inbox', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({}),
        })
        // This message is expected to fail, but it shouldn't return a 404
        // or 401 or anything like that
        endpoints.channels.healthy = response.status === 500
      }
    } catch {
      // Return empty endpoints
    }

    return endpoints
  },
}
