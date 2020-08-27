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
    { address, contracts, logger }: IndexerManagementResolverContext,
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
        endpoints.service.url = service.url
        try {
          const response = await fetch(service.url)
          endpoints.service.healthy = response.ok
        } catch (error) {
          logger?.warn(`Service endpoint is unhealthy`, {
            error: error.message || error,
          })
        }

        endpoints.status.url = new URL('/status', service.url).toString()
        try {
          const response = await fetch(endpoints.status.url, {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({ query: '{ indexingStatuses { subgraph } }' }),
          })
          endpoints.status.healthy = response.ok
        } catch (error) {
          logger?.warn(`Status endpoint is unhealthy`, { error: error.message | error })
        }

        endpoints.channels.url = new URL(
          '/channel-messages-inbox',
          service.url,
        ).toString()

        try {
          const response = await fetch(endpoints.channels.url, {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({}),
          })
          // This message is expected to fail, but it shouldn't return a 404
          // or 401 or anything like that
          endpoints.channels.healthy = response.status === 500
        } catch (error) {
          logger?.warn(`Channels endpoint is unhealthy`, {
            error: error.message || error,
          })
        }
      }
    } catch (error) {
      // Return empty endpoints
      logger?.warn(`Failed to detect service endpoints`, {
        error: error.message || error,
      })
    }

    return endpoints
  },
}
