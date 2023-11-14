import { Signer } from 'ethers'
import { connectContracts } from '.'
import * as DEPLOYED_CONTRACTS from '@graphprotocol/contracts/addresses.json'

jest.mock('ethers')

const mockSigner = jest.fn() as unknown as Signer

describe('Contracts', () => {
  // Test for each supported protocol network
  test.each([1, 5, 42161, 421613])('Connect contracts [chainId: %p]', chainId => {
    const contracts = connectContracts(mockSigner, chainId, DEPLOYED_CONTRACTS)
    expect(contracts).toBeDefined()
  })
})
