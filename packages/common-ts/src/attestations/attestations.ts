import { utils } from 'ethers'
import * as eip712 from './eip712'

const {
  defaultAbiCoder: abi,
  arrayify,
  concat,
  hexlify,
  splitSignature,
  joinSignature,
} = utils

const SIG_SIZE_BYTES = 161
const RECEIPT_SIZE_BYTES = 96
const RECEIPT_TYPE_HASH = eip712.typeHash(
  'Receipt(bytes32 requestCID,bytes32 responseCID,bytes32 subgraphDeploymentID)',
)

export interface Receipt {
  requestCID: string
  responseCID: string
  subgraphDeploymentID: string
}

const SALT = '0xa070ffb1cd7409649bf77822cce74495468e06dbfaef09556838bf188679b9c2'

const encodeReceipt = (receipt: Receipt): string =>
  eip712.hashStruct(
    RECEIPT_TYPE_HASH,
    ['bytes32', 'bytes32', 'bytes32'],
    [receipt.requestCID, receipt.responseCID, receipt.subgraphDeploymentID],
  )

export interface Attestation {
  requestCID: string
  responseCID: string
  subgraphDeploymentID: string
  v: number
  r: string
  s: string
}

export const getDomainSeparator = (
  chainId: number,
  disputeManagerAddress: string,
): string => {
  const domainSeparator = eip712.domainSeparator({
    name: 'Graph Protocol',
    version: '0',
    chainId,
    verifyingContract: disputeManagerAddress,
    salt: SALT,
  })
  return domainSeparator
}

export const createAttestation = async (
  signer: utils.BytesLike,
  chainId: number,
  disputeManagerAddress: string,
  receipt: Receipt,
): Promise<Attestation> => {
  const domainSeparator = getDomainSeparator(chainId, disputeManagerAddress)
  const encodedReceipt = encodeReceipt(receipt)
  const message = eip712.encode(domainSeparator, encodedReceipt)
  const messageHash = utils.keccak256(message)
  const signingKey = new utils.SigningKey(signer)
  const { r, s, v } = signingKey.signDigest(messageHash)

  return {
    requestCID: receipt.requestCID,
    responseCID: receipt.responseCID,
    subgraphDeploymentID: receipt.subgraphDeploymentID,
    v,
    r,
    s,
  }
}

export const encodeAttestation = (attestation: Attestation): string => {
  const data = arrayify(
    abi.encode(
      ['bytes32', 'bytes32', 'bytes32'],
      [attestation.requestCID, attestation.responseCID, attestation.subgraphDeploymentID],
    ),
  )
  const sig = joinSignature(attestation)
  return hexlify(concat([data, sig]))
}

export const decodeAttestation = (attestationData: string): Attestation => {
  const attestationBytes = arrayify(attestationData)
  if (attestationBytes.length !== SIG_SIZE_BYTES) {
    throw new Error('Invalid signature length')
  }

  const [requestCID, responseCID, subgraphDeploymentID] = abi.decode(
    ['bytes32', 'bytes32', 'bytes32'],
    attestationBytes,
  )
  const sig = splitSignature(
    attestationBytes.slice(RECEIPT_SIZE_BYTES, RECEIPT_SIZE_BYTES + SIG_SIZE_BYTES),
  )

  return {
    requestCID,
    responseCID,
    subgraphDeploymentID,
    v: sig.v,
    r: sig.r,
    s: sig.s,
  }
}

export const recoverAttestation = (
  chainId: number,
  disputeManagerAddress: string,
  attestation: Attestation,
): string => {
  const domainSeparator = getDomainSeparator(chainId, disputeManagerAddress)
  const receipt = {
    requestCID: attestation.requestCID,
    responseCID: attestation.responseCID,
    subgraphDeploymentID: attestation.subgraphDeploymentID,
  }
  const encodedReceipt = encodeReceipt(receipt)
  const message = eip712.encode(domainSeparator, encodedReceipt)
  const messageHash = utils.keccak256(message)
  return utils.recoverAddress(
    messageHash,
    joinSignature({ r: attestation.r, s: attestation.s, v: attestation.v }),
  )
}
