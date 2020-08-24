/* eslint-disable @typescript-eslint/ban-types */

import { IndexerManagementResolverContext } from '../client'

export default {
  indexerStatus: async (
    _: {},
    /* eslint-disable @typescript-eslint/no-unused-vars */
    { models, configs, contracts }: IndexerManagementResolverContext,
  ): Promise<object | null> => {
    const isRegistered = await contracts.serviceRegistry.isRegistered(configs.address)
    let url = ''

    if (isRegistered) {
      const service = await contracts.serviceRegistry.services(configs.address)
      url = service.url
    }

    return {
      indexerAddress: configs.address,
      indexerUrl: configs.url,
      isRegistered,
      registeredUrl: url,
      __typename: 'IndexerStatus',
    }
  },
}
