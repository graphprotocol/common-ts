import { Contract, providers } from 'ethers'
import { Signer } from 'ethers'

// Contract addresses
const DEPLOYED_CONTRACTS = require('@graphprotocol/contracts/addresses.json')

// Contract ABIs
import { Curation } from '@graphprotocol/contracts/dist/typechain/contracts/Curation'
const CURATION_ABI = require('@graphprotocol/contracts/dist/abis/Curation.json')
import { DisputeManager } from '@graphprotocol/contracts/dist/typechain/contracts/DisputeManager'
const DISPUTE_MANAGER_ABI = require('@graphprotocol/contracts/dist/abis/DisputeManager.json')
import { EpochManager } from '@graphprotocol/contracts/dist/typechain/contracts/EpochManager'
const EPOCH_MANAGER_ABI = require('@graphprotocol/contracts/dist/abis/EpochManager.json')
import { Gns } from '@graphprotocol/contracts/dist/typechain/contracts/Gns'
const GNS_ABI = require('@graphprotocol/contracts/dist/abis/GNS.json')
import { RewardsManager } from '@graphprotocol/contracts/dist/typechain/contracts/RewardsManager'
const REWARDS_MANAGER_ABI = require('@graphprotocol/contracts/dist/abis/RewardsManager.json')
import { ServiceRegistry } from '@graphprotocol/contracts/dist/typechain/contracts/ServiceRegistry'
const SERVICE_REGISTRY_ABI = require('@graphprotocol/contracts/dist/abis/ServiceRegistry.json')
import { Staking } from '@graphprotocol/contracts/dist/typechain/contracts/Staking'
const STAKING_ABI = require('@graphprotocol/contracts/dist/abis/Staking.json')
import { GraphToken } from '@graphprotocol/contracts/dist/typechain/contracts/GraphToken'
const GRAPH_TOKEN_ABI = require('@graphprotocol/contracts/dist/abis/GraphToken.json')

// TODO: Remove when contracts repo has TypeChain with ethers v5 support.
export interface Contracts {
  curation: Curation
  disputeManager: DisputeManager
  epochManager: EpochManager
  gns: Gns
  rewardsManager: RewardsManager
  serviceRegistry: ServiceRegistry
  staking: Staking
  token: GraphToken
}

export const connect = async (
  providerOrSigner: providers.Provider | Signer,
  chainId: number,
): Promise<Contracts> => {
  let deployedContracts = DEPLOYED_CONTRACTS[`${chainId}`]

  return {
    curation: new Curation(
      deployedContracts.Curation.address,
      CURATION_ABI,
      providerOrSigner,
    ),
    disputeManager: new DisputeManager(
      deployedContracts.DisputeManager.address,
      DISPUTE_MANAGER_ABI,
      providerOrSigner,
    ),
    epochManager: new EpochManager(
      deployedContracts.EpochManager.address,
      EPOCH_MANAGER_ABI,
      providerOrSigner,
    ),
    gns: new Gns(deployedContracts.GNS.address, GNS_ABI, providerOrSigner),
    rewardsManager: new RewardsManager(
      deployedContracts.RewardsManager.address,
      REWARDS_MANAGER_ABI,
      providerOrSigner,
    ),
    serviceRegistry: new ServiceRegistry(
      deployedContracts.ServiceRegistry.address,
      SERVICE_REGISTRY_ABI,
      providerOrSigner,
    ),
    staking: new Staking(
      deployedContracts.Staking.address,
      STAKING_ABI,
      providerOrSigner,
    ),
    token: new GraphToken(
      deployedContracts.GraphToken.address,
      GRAPH_TOKEN_ABI,
      providerOrSigner,
    ),
  }
}
