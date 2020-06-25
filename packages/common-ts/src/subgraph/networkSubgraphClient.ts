import { createClient, Client } from '@urql/core'
import fetch from 'cross-fetch'

export interface NetworkSubgraphClientOptions {
  url: string
}

export const createNetworkSubgraphClient = async (
  options: NetworkSubgraphClientOptions,
): Promise<Client> => {
  return createClient({ url: options.url, fetch })
}
