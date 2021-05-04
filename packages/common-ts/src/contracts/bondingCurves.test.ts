import Decimal from 'decimal.js'
import { BigNumber } from 'ethers'
import {
  nSignalToTokens,
  tokensToNSignal,
  signalToTokens,
  tokensToSignal,
} from './bondingCurves'

Decimal.set({ toExpPos: 28, rounding: Decimal.ROUND_DOWN })

/* Real example query from the subgraph. From this query:
  {
    graphNetwork(id: "1") {
      curationTaxPercentage
      minimumCurationDeposit
    }
    nameSignal(id: "0x0503024fcc5e1bd834530e69d592dbb6e8c03968-0x0503024fcc5e1bd834530e69d592dbb6e8c03968-0") {
      nameSignal
    }
    signal(id: "0xadca0dd4729c8ba3acf3e99f3a9f471ef37b6825-0x31f6fb67c823a07a93bae6b022798eebdf86210033c0e97a1402795c0c2fa99b") {
      signal
    }
    subgraph(id: "0x0503024fcc5e1bd834530e69d592dbb6e8c03968-0"){
      currentVersion {
        subgraphDeployment {
          reserveRatio
          signalAmount
          signalledTokens
        }
      }
      displayName
      id
      nameSignalAmount
    }
  }
*/
export const exampleQueryResult = {
  data: {
    graphNetwork: {
      curationTaxPercentage: 25000,
      minimumCurationDeposit: '1000000000000000000',
    },
    nameSignal: {
      nameSignal: '156124949959959955146',
    },
    signal: {
      signal: '360104151600616787382',
    },
    subgraph: {
      currentVersion: {
        subgraphDeployment: {
          reserveRatio: 500000,
          signalAmount: '360104151600616787382',
          signalledTokens: '129674999999999997955277',
        },
      },
      displayName: 'Omen',
      id: '0x0503024fcc5e1bd834530e69d592dbb6e8c03968-0',
      nameSignalAmount: '360104151600616787382',
    },
  },
}

const result = exampleQueryResult.data
const E18_100K = BigNumber.from('100000000000000000000000')
const EXPECTED_SIGNAL_100K = BigNumber.from('116524634773013815980')
const EXPECTED_TOKENS_156_NSIGNAL = BigNumber.from('88067485298040259035000')
const PPM = BigNumber.from(1000000)

// EXAMPLE QUERY - GLOBAL VALUES
const CURATION_TAX = BigNumber.from(result.graphNetwork.curationTaxPercentage)
const MINIMUM_CURATION_DEPOSIT = BigNumber.from(
  result.graphNetwork.minimumCurationDeposit,
)
///// EXAMPLE QUERY - SUBGRAPH SPECIFIC VALUES
const SUBGRAPH_DEPLOYMENT = result.subgraph.currentVersion.subgraphDeployment
const tokensCuratedOnDeployment = BigNumber.from(SUBGRAPH_DEPLOYMENT.signalledTokens)
const totalVSignal = BigNumber.from(SUBGRAPH_DEPLOYMENT.signalAmount)
const reserveRatio = BigNumber.from(SUBGRAPH_DEPLOYMENT.reserveRatio)
const totalNSignal = BigNumber.from(result.subgraph.nameSignalAmount)
const vSignalGNS = BigNumber.from(result.signal.signal)
const userNSignal = BigNumber.from(result.nameSignal.nameSignal)

describe('Bonding Curves', () => {
  test('tokensToNSignal', () => {
    const res = tokensToNSignal(
      tokensCuratedOnDeployment,
      reserveRatio,
      totalVSignal,
      E18_100K,
      CURATION_TAX,
      MINIMUM_CURATION_DEPOSIT,
      totalNSignal,
      vSignalGNS,
    )
    const vSignal = res[0]
    const nSignal = res[1]
    const tax = res[2]

    expect(vSignal).toEqual(EXPECTED_SIGNAL_100K)
    expect(nSignal).toEqual(EXPECTED_SIGNAL_100K) // v and n same on 1st version
    expect(tax).toEqual(E18_100K.mul(CURATION_TAX).div(PPM))
  })
  test('tokensToSignal', () => {
    const res = tokensToSignal(
      tokensCuratedOnDeployment,
      reserveRatio,
      totalVSignal,
      E18_100K,
      CURATION_TAX,
      MINIMUM_CURATION_DEPOSIT,
    )
    const vSignal = res[0]
    const tax = res[1]

    expect(vSignal).toEqual(EXPECTED_SIGNAL_100K)
    expect(tax).toEqual(E18_100K.mul(CURATION_TAX).div(PPM))
  })
  test('nSignalToTokens', () => {
    const res = nSignalToTokens(
      tokensCuratedOnDeployment,
      reserveRatio,
      totalVSignal,
      userNSignal,
      totalNSignal,
      vSignalGNS,
    )
    const vSignal = res[0]
    const tokens = res[1]

    expect(vSignal).toEqual(userNSignal)
    expect(tokens).toEqual(EXPECTED_TOKENS_156_NSIGNAL)
  })
  test('signalToTokens', () => {
    const res = signalToTokens(
      tokensCuratedOnDeployment,
      reserveRatio,
      totalVSignal,
      vSignalGNS,
    )
    const tokens = res
    expect(tokens).toEqual(tokensCuratedOnDeployment)
  })
})
