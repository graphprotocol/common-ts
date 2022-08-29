import { providers, Signer } from 'ethers'
import graphChain from './chain'

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
import { GraphProxyAdmin } from '@graphprotocol/contracts/dist/types/GraphProxyAdmin'
import { SubgraphNFT } from '@graphprotocol/contracts/dist/types/SubgraphNFT'
import { GraphCurationToken } from '@graphprotocol/contracts/dist/types/GraphCurationToken'
import { L1GraphTokenGateway } from '@graphprotocol/contracts/dist/types/L1GraphTokenGateway'
import { L1Reservoir } from '@graphprotocol/contracts/dist/types/L1Reservoir'
import { BridgeEscrow } from '@graphprotocol/contracts/dist/types/BridgeEscrow'
import { L2GraphToken } from '@graphprotocol/contracts/dist/types/L2GraphToken'
import { L2GraphTokenGateway } from '@graphprotocol/contracts/dist/types/L2GraphTokenGateway'
import { L2Reservoir } from '@graphprotocol/contracts/dist/types/L2Reservoir'


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
import { GraphProxyAdmin__factory } from '@graphprotocol/contracts/dist/types/factories/GraphProxyAdmin__factory'
import { SubgraphNFT__factory } from '@graphprotocol/contracts/dist/types/factories/SubgraphNFT__factory'
import { GraphCurationToken__factory } from '@graphprotocol/contracts/dist/types/factories/GraphCurationToken__factory'
import { L1GraphTokenGateway__factory } from '@graphprotocol/contracts/dist/types/factories/L1GraphTokenGateway__factory'
import { L1Reservoir__factory } from '@graphprotocol/contracts/dist/types/factories/L1Reservoir__factory'
import { BridgeEscrow__factory } from '@graphprotocol/contracts/dist/types/factories/BridgeEscrow__factory'
import { L2GraphToken__factory } from '@graphprotocol/contracts/dist/types/factories/L2GraphToken__factory'
import { L2GraphTokenGateway__factory } from '@graphprotocol/contracts/dist/types/factories/L2GraphTokenGateway__factory'
import { L2Reservoir__factory } from '@graphprotocol/contracts/dist/types/factories/L2Reservoir__factory'

export const GraphChain = graphChain

export interface NetworkContracts {
  curation: Curation
  disputeManager: DisputeManager
  epochManager: EpochManager
  gns: GNS
  rewardsManager: RewardsManager
  serviceRegistry: ServiceRegistry
  staking: Staking
  token: GraphToken | L2GraphToken
  controller: Controller
  allocationExchange: AllocationExchange
  graphProxyAdmin: GraphProxyAdmin
  subgraphNFT: SubgraphNFT
  graphCurationToken: GraphCurationToken

  // Only L1
  l1GraphTokenGateway?: L1GraphTokenGateway
  l1Reservoir?: L1Reservoir
  bridgeEscrow?: BridgeEscrow

  // Only L2
  l2GraphTokenGateway?: L2GraphTokenGateway
  l2Reservoir?: L2Reservoir
}

export const connectContracts = async (
  providerOrSigner: providers.Provider | Signer,
  chainId: number,
): Promise<NetworkContracts> => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const deployedContracts = (DEPLOYED_CONTRACTS as any)[`${chainId}`]

  const GraphTokenFactory = GraphChain.isL1(chainId) ? GraphToken__factory : L2GraphToken__factory

  const contracts: NetworkContracts = {
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
    token: GraphTokenFactory.connect(
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
    graphProxyAdmin: GraphProxyAdmin__factory.connect(
      deployedContracts.GraphProxyAdmin.address,
      providerOrSigner,
    ),
    subgraphNFT: SubgraphNFT__factory.connect(
      deployedContracts.SubgraphNFT.address,
      providerOrSigner,
    ),
    graphCurationToken: GraphCurationToken__factory.connect(
      deployedContracts.GraphCurationToken.address,
      providerOrSigner,
    ),
  }

  if (GraphChain.isL1(chainId)) {
    contracts.l1GraphTokenGateway = L1GraphTokenGateway__factory.connect(
      deployedContracts.L1GraphTokenGateway.address,
      providerOrSigner,
    )
    contracts.l1Reservoir = L1Reservoir__factory.connect(
      deployedContracts.L1Reservoir.address,
      providerOrSigner,
    )
    contracts.bridgeEscrow = BridgeEscrow__factory.connect(
      deployedContracts.BridgeEscrow.address,
      providerOrSigner,
    )
  } else if (GraphChain.isL2(chainId)) {
    contracts.l2GraphTokenGateway = L2GraphTokenGateway__factory.connect(
      deployedContracts.L2GraphTokenGateway.address,
      providerOrSigner,
    )
    contracts.l2Reservoir = L2Reservoir__factory.connect(
      deployedContracts.L2Reservoir.address,
      providerOrSigner,
    )
  }

  return contracts
}
