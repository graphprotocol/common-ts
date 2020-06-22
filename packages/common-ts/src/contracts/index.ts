import { Contract, providers } from 'ethers'
import { Signer } from 'ethers'

// Contract addresses
const DEPLOYED_CONTRACTS = require('@graphprotocol/contracts/addresses.json')

// Contract ABIs
const CURATION_ABI = require('@graphprotocol/contracts/dist/abis/Curation.json')
const DISPUTE_MANAGER_ABI = require('@graphprotocol/contracts/dist/abis/DisputeManager.json')
const EPOCH_MANAGER_ABI = require('@graphprotocol/contracts/dist/abis/EpochManager.json')
const GNS_ABI = require('@graphprotocol/contracts/dist/abis/GNS.json')
const REWARDS_MANAGER_ABI = require('@graphprotocol/contracts/dist/abis/RewardsManager.json')
const SERVICE_REGISTRY_ABI = require('@graphprotocol/contracts/dist/abis/ServiceRegistry.json')
const STAKING_ABI = require('@graphprotocol/contracts/dist/abis/Staking.json')
const GRAPH_TOKEN_ABI = require('@graphprotocol/contracts/dist/abis/GraphToken.json')

// TODO: Remove when contracts repo has TypeChain with ethers v5 support.
export interface NetworkContracts {
  curation: any
  disputeManager: any
  epochManager: any
  gns: any
  rewardsManager: any
  serviceRegistry: any
  staking: any
  token: any
}

export const connectContracts = async (
  providerOrSigner: providers.Provider | Signer,
  chainId: number,
): Promise<NetworkContracts> => {
  let deployedContracts = DEPLOYED_CONTRACTS[`${chainId}`]

  return {
    curation: new Contract(
      deployedContracts.Curation.address,
      CURATION_ABI,
      providerOrSigner,
    ),
    disputeManager: new Contract(
      deployedContracts.DisputeManager.address,
      DISPUTE_MANAGER_ABI,
      providerOrSigner,
    ),
    epochManager: new Contract(
      deployedContracts.EpochManager.address,
      EPOCH_MANAGER_ABI,
      providerOrSigner,
    ),
    gns: new Contract(deployedContracts.GNS.address, GNS_ABI, providerOrSigner),
    rewardsManager: new Contract(
      deployedContracts.RewardsManager.address,
      REWARDS_MANAGER_ABI,
      providerOrSigner,
    ),
    serviceRegistry: new Contract(
      deployedContracts.ServiceRegistry.address,
      SERVICE_REGISTRY_ABI,
      providerOrSigner,
    ),
    staking: new Contract(
      deployedContracts.Staking.address,
      STAKING_ABI,
      providerOrSigner,
    ),
    token: new Contract(
      deployedContracts.GraphToken.address,
      GRAPH_TOKEN_ABI,
      providerOrSigner,
    ),
  }
}
