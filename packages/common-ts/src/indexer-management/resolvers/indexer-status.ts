/* eslint-disable @typescript-eslint/ban-types */

import { IndexerManagementResolverContext } from '../client'
import geohash from 'ngeohash'

export default {
  indexerRegistration: async (
    _: {},
    { address, contracts }: IndexerManagementResolverContext,
  ): Promise<object | null> => {
    const registered = await contracts.serviceRegistry.registered(address)

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
        response = await fetch(endpoints.status.url)
        endpoints.status.healthy = response.ok

        endpoints.channels.url = new URL(
          '/channel-messages-inbox',
          service.url,
        ).toString()
        response = await fetch(endpoints.channels.url)
        endpoints.channels.healthy = response.ok
      }
    } catch {
      // Return empty endpoints
    }

    return endpoints
  },
}
