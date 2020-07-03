import { BigNumber, BigNumberish } from 'ethers'
import { parseUnits, formatUnits } from 'ethers/lib/utils'

export const formatGRT = (value: BigNumberish): string => formatUnits(value, 18)

export const parseGRT = (grt: string): BigNumber => parseUnits(grt, 18)
