import { utils } from 'ethers'
import base58 from 'bs58'

export class SubgraphName {
  kind: 'name' = 'name' as const
  value: string

  constructor(name: string) {
    this.value = name
  }

  toString(): string {
    return this.value
  }
}

// Security: Input validation
const bytes32Check = /^0x[0-9a-f]{64}$/
const multiHashCheck = /^Qm[1-9a-km-zA-HJ-NP-Z]{44}$/

export class SubgraphDeploymentID {
  kind: 'deployment-id' = 'deployment-id' as const

  // Hexadecimal (bytes32) representation of the subgraph deployment Id
  value: string

  constructor(id: string) {
    let value
    // Security: Input validation
    if (multiHashCheck.test(id)) {
      value = utils.hexlify(base58.decode(id).slice(2))
    } else if (bytes32Check.test(id)) {
      value = id
    }

    if (value != null) {
      this.value = value
    } else {
      throw new Error(`Invalid subgraph deployment ID: ${id}`)
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
