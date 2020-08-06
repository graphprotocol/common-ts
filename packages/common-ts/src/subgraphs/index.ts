import { utils } from 'ethers'
import base58 from 'bs58'

export class SubgraphName {
  kind: 'name' = 'name'
  value: string

  constructor(name: string) {
    this.value = name
  }

  toString(): string {
    return this.value
  }
}

export class SubgraphDeploymentID {
  kind: 'deployment-id' = 'deployment-id'

  // Hexadecimal (bytes32) representation of the subgraph deployment Id
  value: string

  constructor(id: string) {
    if (id.startsWith('Qm')) {
      this.value = utils.hexlify(base58.decode(id).slice(2))
    } else {
      this.value = id
    }
  }

  toString(): string {
    return this.value
  }

  get display(): { bytes32: string; ipfsHash: string } {
    return {
      bytes32: this.bytes32,
      ipfsHash: this.ipfsHash,
    }
  }

  get bytes32(): string {
    return this.value
  }

  get ipfsHash(): string {
    return base58.encode([0x12, 0x20, ...utils.arrayify(this.value)])
  }
}

export type SubgraphNameOrDeploymentID = SubgraphName | SubgraphDeploymentID
