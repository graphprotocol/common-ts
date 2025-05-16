import { BigNumberish, formatUnits, parseUnits } from 'ethers'

export const formatGRT = (value: BigNumberish): string => formatUnits(value, 18)

export const parseGRT = (grt: string): bigint => parseUnits(grt, 18)
