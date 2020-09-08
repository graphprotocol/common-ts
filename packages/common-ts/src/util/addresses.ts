import { utils } from 'ethers'

/**
 * A normalized address in checksum format.
 */
export type Address = string & { _isAddress: void }

/**
 * Converts an address to checksum format and returns a typed instance.
 */
export const toAddress = (s: Address | string): Address =>
  typeof s === 'string' ? (utils.getAddress(s) as Address) : s
