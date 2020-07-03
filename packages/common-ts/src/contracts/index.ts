import { providers } from 'ethers'
import { Signer } from 'ethers'

// Contract addresses
// eslint-disable-next-line @typescript-eslint/no-var-requires
const DEPLOYED_CONTRACTS = require('@graphprotocol/contracts/addresses.json')

// Contract ABIs
import { Curation } from '@graphprotocol/contracts/dist/typechain/contracts/Curation'
import { DisputeManager } from '@graphprotocol/contracts/dist/typechain/contracts/DisputeManager'
import { EpochManager } from '@graphprotocol/contracts/dist/typechain/contracts/EpochManager'
import { Gns } from '@graphprotocol/contracts/dist/typechain/contracts/Gns'
import { RewardsManager } from '@graphprotocol/contracts/dist/typechain/contracts/RewardsManager'
import { ServiceRegistry } from '@graphprotocol/contracts/dist/typechain/contracts/ServiceRegistry'
import { Staking } from '@graphprotocol/contracts/dist/typechain/contracts/Staking'
import { GraphToken } from '@graphprotocol/contracts/dist/typechain/contracts/GraphToken'

// Contract factories
import { CurationFactory } from '@graphprotocol/contracts/dist/typechain/contracts/CurationContract'
import { DisputeManagerFactory } from '@graphprotocol/contracts/dist/typechain/contracts/DisputeManagerContract'
import { EpochManagerFactory } from '@graphprotocol/contracts/dist/typechain/contracts/EpochManagerContract'
import { GnsFactory } from '@graphprotocol/contracts/dist/typechain/contracts/GnsContract'
import { RewardsManagerFactory } from '@graphprotocol/contracts/dist/typechain/contracts/RewardsManagerContract'
import { ServiceRegistryFactory } from '@graphprotocol/contracts/dist/typechain/contracts/ServiceRegistryContract'
import { StakingFactory } from '@graphprotocol/contracts/dist/typechain/contracts/StakingContract'
import { GraphTokenFactory } from '@graphprotocol/contracts/dist/typechain/contracts/GraphTokenContract'

// TODO: Remove when contracts repo has TypeChain with ethers v5 support.
export interface NetworkContracts {
  curation: Curation
  disputeManager: DisputeManager
  epochManager: EpochManager
  gns: Gns
  rewardsManager: RewardsManager
  serviceRegistry: ServiceRegistry
  staking: Staking
  token: GraphToken
}

export const connectContracts = async (
  providerOrSigner: providers.Provider | Signer,
  chainId: number,
): Promise<NetworkContracts> => {
  const deployedContracts = DEPLOYED_CONTRACTS[`${chainId}`]

  return {
    curation: CurationFactory.connect(
      deployedContracts.Curation.address,
      providerOrSigner,
    ),
    disputeManager: DisputeManagerFactory.connect(
      deployedContracts.DisputeManager.address,
      providerOrSigner,
    ),
    epochManager: EpochManagerFactory.connect(
      deployedContracts.EpochManager.address,
      providerOrSigner,
    ),
    gns: GnsFactory.connect(deployedContracts.GNS.address, providerOrSigner),
    rewardsManager: RewardsManagerFactory.connect(
      deployedContracts.RewardsManager.address,
      providerOrSigner,
    ),
    serviceRegistry: ServiceRegistryFactory.connect(
      deployedContracts.ServiceRegistry.address,
      providerOrSigner,
    ),
    staking: StakingFactory.connect(deployedContracts.Staking.address, providerOrSigner),
    token: GraphTokenFactory.connect(
      deployedContracts.GraphToken.address,
      providerOrSigner,
    ),
  }
}
