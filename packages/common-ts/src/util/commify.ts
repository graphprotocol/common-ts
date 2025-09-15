import 'ethers'

export function commify(value: string): string {
  const match = value.match(/^(-?)([0-9]*)(\.?)([0-9]*)$/)
  if (!match || (!match[2] && !match[4])) {
    throw new Error(`bad formatted number: ${JSON.stringify(value)}`)
  }

  const neg = match[1]
  const whole = BigInt(match[2] || 0).toLocaleString('en-us')
  const frac = match[4] ? match[4].match(/^(.*?)0*$/)?.[1] || '0' : '0'

  return `${neg}${whole}.${frac}`
}
