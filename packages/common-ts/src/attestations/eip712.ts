import { utils } from 'ethers'

// Hashes a type signature based on the `typeHash` defined on
// https://github.com/ethereum/EIPs/blob/master/EIPS/eip-712.md#definition-of-hashstruct.
//
// The type signature is expected to follow the `encodeType` format described on
// https://github.com/ethereum/EIPs/blob/master/EIPS/eip-712.md#definition-of-encodetype.
export const typeHash = (typeSignature: string): string =>
  utils.keccak256(utils.toUtf8Bytes(typeSignature))

// Encodes a list of values according to the given types.
//
// See https://github.com/ethereum/EIPs/blob/master/EIPS/eip-712.md#definition-of-encodedata
// for details.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const encodeData = (types: string[], values: any[]): string => {
  const transformedTypes = []
  const transformedValues = []

  // Values of types `bytes` and `strings` need to be hashed using keccak256
  for (let i = 0; i < types.length; i++) {
    if (types[i] === 'string' || types[i] === 'bytes') {
      transformedTypes[i] = 'bytes32'
      transformedValues[i] = utils.keccak256(utils.toUtf8Bytes(values[i]))
    } else {
      transformedTypes[i] = types[i]
      transformedValues[i] = values[i]
    }
  }

  return utils.defaultAbiCoder.encode(transformedTypes, transformedValues)
}

// Hashes a struct based on the hash of a type signature (see `typeHash`),
// a list of struct field types and unencoded values for these fields.
//
// NOTE: Does not support recursion yet.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const hashStruct = (typeHash: string, types: string[], values: any[]): string => {
  return utils.keccak256(encodeData(['bytes32', ...types], [typeHash, ...values]))
}

const EIP712_DOMAIN_TYPE_HASH = typeHash(
  'EIP712Domain(string name,string version,uint256 chainId,address verifyingContract,bytes32 salt)',
)

// An EIP-712 domain struct.
export interface EIP712Domain {
  name: string
  version: string
  chainId: number
  verifyingContract: string
  salt: string
}

// Creates a domain separator from an EIP-712 domain struct.
//
// See https://github.com/ethereum/EIPs/blob/master/EIPS/eip-712.md#definition-of-domainseparator
// for more details.
export const domainSeparator = (domain: EIP712Domain): string =>
  hashStruct(
    EIP712_DOMAIN_TYPE_HASH,
    ['string', 'string', 'uint256', 'address', 'bytes32'],
    [domain.name, domain.version, domain.chainId, domain.verifyingContract, domain.salt],
  )

// Encodes a message using a domain separator, as described on
// https://github.com/ethereum/EIPs/blob/master/EIPS/eip-712.md#specification.
//
// Assumes that the message has been encoded according to EIP-712,
// e.g. using `hashStruct`.
export const encode = (domainSeparator: string, message: string): string =>
  '0x1901' + domainSeparator.substring(2) + message.substring(2)
