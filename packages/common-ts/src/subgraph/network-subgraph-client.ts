import ApolloClient, { InMemoryCache } from 'apollo-boost'

export interface NetworkSubgraphClientOptions {
  url: string
}

export const createNetworkSubgraphClient = async (
  options: NetworkSubgraphClientOptions,
): Promise<ApolloClient<InMemoryCache>> => {
  return new ApolloClient({
    uri: options.url,
    cache: new InMemoryCache(),
  })
}
