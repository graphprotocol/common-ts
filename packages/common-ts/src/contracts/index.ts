import { providers, Signer } from 'ethers'
import graphChain from './chain'

// Contract ABIs
import { Curation } from '@graphprotocol/contracts/dist/types/Curation'
import { DisputeManager } from '@graphprotocol/contracts/dist/types/DisputeManager'
import { EpochManager } from '@graphprotocol/contracts/dist/types/EpochManager'
import { GNS } from '@graphprotocol/contracts/dist/types/GNS'
import { RewardsManager } from '@graphprotocol/contracts/dist/types/RewardsManager'
import { ServiceRegistry } from '@graphprotocol/contracts/dist/types/ServiceRegistry'
import { IL1Staking } from '@graphprotocol/contracts/dist/types/IL1Staking'
import { IL2Staking } from '@graphprotocol/contracts/dist/types/IL2Staking'
import { GraphToken } from '@graphprotocol/contracts/dist/types/GraphToken'
import { Controller } from '@graphprotocol/contracts/dist/types/Controller'
import { AllocationExchange } from '@graphprotocol/contracts/dist/types/AllocationExchange'
import { GraphProxyAdmin } from '@graphprotocol/contracts/dist/types/GraphProxyAdmin'
import { SubgraphNFT } from '@graphprotocol/contracts/dist/types/SubgraphNFT'
import { GraphCurationToken } from '@graphprotocol/contracts/dist/types/GraphCurationToken'
import { L1GraphTokenGateway } from '@graphprotocol/contracts/dist/types/L1GraphTokenGateway'
import { BridgeEscrow } from '@graphprotocol/contracts/dist/types/BridgeEscrow'
import { L2GraphToken } from '@graphprotocol/contracts/dist/types/L2GraphToken'
import { L2GraphTokenGateway } from '@graphprotocol/contracts/dist/types/L2GraphTokenGateway'
import { L2Curation } from '@graphprotocol/contracts/dist/types/L2Curation'

// Contract factories
import { Curation__factory } from '@graphprotocol/contracts/dist/types/factories/Curation__factory'
import { L2Curation__factory } from '@graphprotocol/contracts/dist/types/factories/L2Curation__factory'
import { DisputeManager__factory } from '@graphprotocol/contracts/dist/types/factories/DisputeManager__factory'
import { EpochManager__factory } from '@graphprotocol/contracts/dist/types/factories/EpochManager__factory'
import { GNS__factory } from '@graphprotocol/contracts/dist/types/factories/GNS__factory'
import { RewardsManager__factory } from '@graphprotocol/contracts/dist/types/factories/RewardsManager__factory'
import { ServiceRegistry__factory } from '@graphprotocol/contracts/dist/types/factories/ServiceRegistry__factory'
import { IL1Staking__factory } from '@graphprotocol/contracts/dist/types/factories/IL1Staking__factory'
import { IL2Staking__factory } from '@graphprotocol/contracts/dist/types/factories/IL2Staking__factory'
import { GraphToken__factory } from '@graphprotocol/contracts/dist/types/factories/GraphToken__factory'
import { Controller__factory } from '@graphprotocol/contracts/dist/types/factories/Controller__factory'
import { AllocationExchange__factory } from '@graphprotocol/contracts/dist/types/factories/AllocationExchange__factory'
import { GraphProxyAdmin__factory } from '@graphprotocol/contracts/dist/types/factories/GraphProxyAdmin__factory'
import { SubgraphNFT__factory } from '@graphprotocol/contracts/dist/types/factories/SubgraphNFT__factory'
import { GraphCurationToken__factory } from '@graphprotocol/contracts/dist/types/factories/GraphCurationToken__factory'
import { L1GraphTokenGateway__factory } from '@graphprotocol/contracts/dist/types/factories/L1GraphTokenGateway__factory'
import { BridgeEscrow__factory } from '@graphprotocol/contracts/dist/types/factories/BridgeEscrow__factory'
import { L2GraphToken__factory } from '@graphprotocol/contracts/dist/types/factories/L2GraphToken__factory'
import { L2GraphTokenGateway__factory } from '@graphprotocol/contracts/dist/types/factories/L2GraphTokenGateway__factory'

export const GraphChain = graphChain

export interface NetworkContracts {
  curation: Curation | L2Curation
  disputeManager: DisputeManager
  epochManager: EpochManager
  gns: GNS
  rewardsManager: RewardsManager
  serviceRegistry: ServiceRegistry
  staking: IL1Staking | IL2Staking
  token: GraphToken | L2GraphToken
  controller: Controller
  allocationExchange: AllocationExchange
  graphProxyAdmin: GraphProxyAdmin
  subgraphNFT: SubgraphNFT
  graphCurationToken: GraphCurationToken

  // Only L1
  l1GraphTokenGateway?: L1GraphTokenGateway
  bridgeEscrow?: BridgeEscrow

  // Only L2
  l2GraphTokenGateway?: L2GraphTokenGateway
}

export type AddressBook = { [key: string]: { [key: string]: { address: string } } }

export const connectContracts = async (
  providerOrSigner: providers.Provider | Signer,
  chainId: number,
  addressBook: AddressBook,
): Promise<NetworkContracts> => {
  const deployedContracts = addressBook[`${chainId}`]
  if (!deployedContracts) {
    throw new Error(`chainId: '${chainId}' has no deployed contracts`)
  }

  const getContractAddress = (contractName: string) => {
    if (!deployedContracts[contractName]) {
      throw new Error(
        `Deployed contract '${contractName}' is undefined for chainId: '${chainId}'`,
      )
    }
    const address = deployedContracts[contractName].address
    if (!address) {
      throw new Error(
        `Deployed contract '${contractName}' address is undefined for chainId: '${chainId}'`,
      )
    }
    return address
  }

  const GraphTokenFactory = GraphChain.isL1(chainId)
    ? GraphToken__factory
    : L2GraphToken__factory

  const graphTokenAddress = GraphChain.isL1(chainId)
    ? getContractAddress('GraphToken')
    : getContractAddress('L2GraphToken')

  const staking = GraphChain.isL1(chainId)
    ? IL1Staking__factory.connect(getContractAddress('L1Staking'), providerOrSigner)
    : IL2Staking__factory.connect(getContractAddress('L2Staking'), providerOrSigner)

  const gns = GraphChain.isL1(chainId)
    ? GNS__factory.connect(getContractAddress('L1GNS'), providerOrSigner)
    : GNS__factory.connect(getContractAddress('L2GNS'), providerOrSigner)

  const curation = GraphChain.isL1(chainId)
    ? Curation__factory.connect(getContractAddress('Curation'), providerOrSigner)
    : L2Curation__factory.connect(getContractAddress('L2Curation'), providerOrSigner)

  const contracts: NetworkContracts = {
    disputeManager: DisputeManager__factory.connect(
      getContractAddress('DisputeManager'),
      providerOrSigner,
    ),
    epochManager: EpochManager__factory.connect(
      getContractAddress('EpochManager'),
      providerOrSigner,
    ),
    gns,
    curation,
    rewardsManager: RewardsManager__factory.connect(
      getContractAddress('RewardsManager'),
      providerOrSigner,
    ),
    serviceRegistry: ServiceRegistry__factory.connect(
      getContractAddress('ServiceRegistry'),
      providerOrSigner,
    ),
    staking,
    token: GraphTokenFactory.connect(graphTokenAddress, providerOrSigner),
    controller: Controller__factory.connect(
      getContractAddress('Controller'),
      providerOrSigner,
    ),
    allocationExchange: AllocationExchange__factory.connect(
      getContractAddress('AllocationExchange'),
      providerOrSigner,
    ),
    graphProxyAdmin: GraphProxyAdmin__factory.connect(
      getContractAddress('GraphProxyAdmin'),
      providerOrSigner,
    ),
    subgraphNFT: SubgraphNFT__factory.connect(
      getContractAddress('SubgraphNFT'),
      providerOrSigner,
    ),
    graphCurationToken: GraphCurationToken__factory.connect(
      getContractAddress('GraphCurationToken'),
      providerOrSigner,
    ),
  }

  if (GraphChain.isL1(chainId)) {
    if (deployedContracts.L1GraphTokenGateway) {
      contracts.l1GraphTokenGateway = L1GraphTokenGateway__factory.connect(
        getContractAddress('L1GraphTokenGateway'),
        providerOrSigner,
      )
    }
    if (deployedContracts.BridgeEscrow) {
      contracts.bridgeEscrow = BridgeEscrow__factory.connect(
        getContractAddress('BridgeEscrow'),
        providerOrSigner,
      )
    }
  } else if (GraphChain.isL2(chainId)) {
    if (deployedContracts.L2GraphTokenGateway) {
      contracts.l2GraphTokenGateway = L2GraphTokenGateway__factory.connect(
        getContractAddress('L2GraphTokenGateway'),
        providerOrSigner,
      )
    }
  }

  return contracts
}
