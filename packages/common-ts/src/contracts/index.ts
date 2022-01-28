import { providers, Signer } from 'ethers'

// Contract addresses
import * as DEPLOYED_CONTRACTS from '@graphprotocol/contracts/addresses.json'

// Contract ABIs
import { Curation } from '@graphprotocol/contracts/dist/types/Curation'
import { DisputeManager } from '@graphprotocol/contracts/dist/types/DisputeManager'
import { EpochManager } from '@graphprotocol/contracts/dist/types/EpochManager'
import { GNS } from '@graphprotocol/contracts/dist/types/GNS'
import { RewardsManager } from '@graphprotocol/contracts/dist/types/RewardsManager'
import { ServiceRegistry } from '@graphprotocol/contracts/dist/types/ServiceRegistry'
import { Staking } from '@graphprotocol/contracts/dist/types/Staking'
import { GraphToken } from '@graphprotocol/contracts/dist/types/GraphToken'
import { Controller } from '@graphprotocol/contracts/dist/types/Controller'
import { AllocationExchange } from '@graphprotocol/contracts/dist/types/AllocationExchange'

// Contract factories
import { Curation__factory } from '@graphprotocol/contracts/dist/types/factories/Curation__factory'
import { DisputeManager__factory } from '@graphprotocol/contracts/dist/types/factories/DisputeManager__factory'
import { EpochManager__factory } from '@graphprotocol/contracts/dist/types/factories/EpochManager__factory'
import { GNS__factory } from '@graphprotocol/contracts/dist/types/factories/GNS__factory'
import { RewardsManager__factory } from '@graphprotocol/contracts/dist/types/factories/RewardsManager__factory'
import { ServiceRegistry__factory } from '@graphprotocol/contracts/dist/types/factories/ServiceRegistry__factory'
import { Staking__factory } from '@graphprotocol/contracts/dist/types/factories/Staking__factory'
import { GraphToken__factory } from '@graphprotocol/contracts/dist/types/factories/GraphToken__factory'
import { Controller__factory } from '@graphprotocol/contracts/dist/types/factories/Controller__factory'
import { AllocationExchange__factory } from '@graphprotocol/contracts/dist/types/factories/AllocationExchange__factory'

export interface NetworkContracts {
  curation: Curation
  disputeManager: DisputeManager
  epochManager: EpochManager
  gns: GNS
  rewardsManager: RewardsManager
  serviceRegistry: ServiceRegistry
  staking: Staking
  token: GraphToken
  controller: Controller
  allocationExchange: AllocationExchange
}

export const connectContracts = async (
  providerOrSigner: providers.Provider | Signer,
  chainId: number,
): Promise<NetworkContracts> => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const deployedContracts = (DEPLOYED_CONTRACTS as any)[`${chainId}`]
  return {
    curation: Curation__factory.connect(
      deployedContracts.Curation.address,
      providerOrSigner,
    ),
    disputeManager: DisputeManager__factory.connect(
      deployedContracts.DisputeManager.address,
      providerOrSigner,
    ),
    epochManager: EpochManager__factory.connect(
      deployedContracts.EpochManager.address,
      providerOrSigner,
    ),
    gns: GNS__factory.connect(deployedContracts.GNS.address, providerOrSigner),
    rewardsManager: RewardsManager__factory.connect(
      deployedContracts.RewardsManager.address,
      providerOrSigner,
    ),
    serviceRegistry: ServiceRegistry__factory.connect(
      deployedContracts.ServiceRegistry.address,
      providerOrSigner,
    ),
    staking: Staking__factory.connect(
      deployedContracts.Staking.address,
      providerOrSigner,
    ),
    token: GraphToken__factory.connect(
      deployedContracts.GraphToken.address,
      providerOrSigner,
    ),
    controller: Controller__factory.connect(
      deployedContracts.Controller.address,
      providerOrSigner,
    ),
    allocationExchange: AllocationExchange__factory.connect(
      deployedContracts.AllocationExchange.address,
      providerOrSigner,
    ),
  }
}
