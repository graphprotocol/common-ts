import Decimal from 'decimal.js'
import { BigNumber } from 'ethers'

// constants for convenience
const ZERO = BigNumber.from(0)
const TWO = BigNumber.from(2)
const MAX_WEIGHT = BigNumber.from(1000000)
const PPM = BigNumber.from(1000000)
const ONE_D = new Decimal(1)

// global contract value, non-upgradeable, no need to query subgraph for it
const SIGNAL_PER_MINIMUM_DEPOSIT = BigNumber.from('1000000000000000000')

function decimalToBN(dec: Decimal): BigNumber {
  return BigNumber.from(dec.toString())
}

/**
 * @dev Calculate nSignal to be returned for an amount of GRT.
 * @param _tokensCuratedOnDeployment Total tokens curated on the SubgraphDeployment
 * @param _reserveRatio Reserve ratio for the SubgraphDeployment (in PPM)
 * @param _totalVSignal Total vSignal of the SubgraphDeployment
 * @param _tokensIn The tokens the user wants to spend to mint nSignal
 * @param _curationTax The current curation tax of the network (a global state variable)
 * @param _minimumCurationDeposit Minimum curation deposit (a global state variable)
 * @param _totalNSignal Total nSignal of the Subgraph
 * @param _vSignalGNS Total vSignal owned by the GNS
 * @return [vSignal, nSignal, curationTax]
 */
export function tokensToNSignal(
  _tokensCuratedOnDeployment: BigNumber,
  _reserveRatio: BigNumber,
  _totalVSignal: BigNumber,
  _tokensIn: BigNumber,
  _curationTax: BigNumber,
  _minimumCurationDeposit: BigNumber,
  _totalNSignal: BigNumber,
  _vSignalGNS: BigNumber,
): [BigNumber, BigNumber, BigNumber] {
  const [vSignal, curationTax] = tokensToSignal(
    _tokensCuratedOnDeployment,
    _reserveRatio,
    _totalVSignal,
    _tokensIn,
    _curationTax,
    _minimumCurationDeposit,
  )

  const nSignal = vSignalToNSignal(_totalNSignal, _vSignalGNS, vSignal)
  return [vSignal, nSignal, curationTax]
}

/**
 * @dev Calculate vSignal to be returned for an amount of GRT.
 * @param _tokensCuratedOnDeployment Total tokens curated on the SubgraphDeployment
 * @param _reserveRatio Reserve ratio for the SubgraphDeployment (in PPM)
 * @param _totalVSignal Total vSignal of the SubgraphDeployment
 * @param _tokensIn The tokens the user wants to spend to mint nSignal
 * @param _curationTax The current curation tax of the network (a global state variable)
 * @param _minimumCurationDeposit Minimum curation deposit (a global state variable)
 * @return [signalOut, tax]
 */
export function tokensToSignal(
  _tokensCuratedOnDeployment: BigNumber,
  _reserveRatio: BigNumber,
  _totalVSignal: BigNumber,
  _tokensIn: BigNumber,
  _curationTax: BigNumber,
  _minimumCurationDeposit: BigNumber,
): [BigNumber, BigNumber] {
  const tax: BigNumber = _tokensIn.mul(_curationTax).div(PPM)
  let signalOut: BigNumber

  const tokensMinusTax: BigNumber = _tokensIn.sub(tax)
  if (_tokensCuratedOnDeployment == ZERO) {
    if (_tokensIn.lt(_minimumCurationDeposit)) {
      console.warn(
        'ERROR: Curation deposit is below minimum required. This contract call would fail on the EVM. We return [0,0] here',
      )
      return [ZERO, ZERO]
    }

    signalOut = purchaseTargetAmount(
      SIGNAL_PER_MINIMUM_DEPOSIT,
      _minimumCurationDeposit,
      _reserveRatio,
      tokensMinusTax.sub(_minimumCurationDeposit),
    )
  } else {
    signalOut = purchaseTargetAmount(
      _totalVSignal,
      _tokensCuratedOnDeployment,
      _reserveRatio,
      tokensMinusTax,
    )
  }
  return [signalOut, tax]
}

/**
 * @dev Calculate nSignal to be returned for an amount of vSignal.
 * @param _totalNSignal Total nSignal
 * @param _vSignalGNS Total vSignal owned by the GNS
 * @param _vSignalIn Amount of vSignal to exchange for nSignal
 * @return Amount of nSignal that can be bought
 */
function vSignalToNSignal(
  _totalNSignal: BigNumber,
  _vSignalGNS: BigNumber,
  _vSignalIn: BigNumber,
): BigNumber {
  // always can initalize at 1 to 1, and avoid division by zero
  if (_vSignalGNS == ZERO) {
    return _vSignalIn
  }
  // Here we simplify, and do NOT use bancor formula, because we know that the
  // nameReserveRatio should always be 1000000 (i.e. 1 in PPM)
  // The formula simplifies to _totalNSignal * _vSignalIn / _vSignalGNS
  return _totalNSignal.mul(_vSignalIn).div(_vSignalGNS)
}

/**
 * @dev Calculate GRT to be received for an amount of nSignal being burnt
 * @param _tokensCuratedOnDeployment Total tokens curated on the SubgraphDeployment
 * @param _reserveRatio Reserve ratio for the SubgraphDeployment (in PPM)
 * @param _totalVSignal Total vSignal of the SubgraphDeployment
 * @param _nSignalIn The nSignal the user wants to burn to receive GRT
 * @param _totalNSignal Total nSignal of the Subgraph
 * @param _vSignalGNS Total vSignal owned by the GNS
 * @return [vSignalOut, tokensOut]
 */
export function nSignalToTokens(
  _tokensCuratedOnDeployment: BigNumber,
  _reserveRatio: BigNumber,
  _totalVSignal: BigNumber,
  _nSignalIn: BigNumber,
  _totalNSignal: BigNumber,
  _vSignalGNS: BigNumber,
): [BigNumber, BigNumber] {
  const vSignalOut = nSignalToVSignal(_totalNSignal, _vSignalGNS, _nSignalIn)
  const tokensOut = signalToTokens(
    _tokensCuratedOnDeployment,
    _reserveRatio,
    _totalVSignal,
    vSignalOut,
  )
  return [vSignalOut, tokensOut]
}

/**
 * @dev Calculate vSignal to be returned for an amount of nSignal being burnt.
 * @param _totalNSignal Total nSignal of the Subgraph
 * @param _vSignalGNS Total vSignal owned by the GNS
 * @param _nSignalIn Amount of nSignal to exchange for vSignal
 * @return Amount of vSignal to be received
 */
function nSignalToVSignal(
  _totalNSignal: BigNumber,
  _vSignalGNS: BigNumber,
  _nSignalIn: BigNumber,
): BigNumber {
  // Here we simplify, and do NOT use bancor formula, because we know that the
  // nameReserveRatio should always be 1000000 (i.e. 1 in PPM)
  // The formula simplifies to _vSignalGNS * _nSignalIn / _totalNSignal
  return _vSignalGNS.mul(_nSignalIn).div(_totalNSignal)
}

/**
 * @dev Calculate tokens received from burning vSignal
 * @param _tokensCuratedOnDeployment Total tokens curated on the SubgraphDeployment
 * @param _reserveRatio Reserve ratio for the SubgraphDeployment (in PPM)
 * @param _totalVSignal Total vSignal of the SubgraphDeployment
 * @param _vSignalIn The vSignal to burn for GRT
 * @return tokens received from burning vSignal
 */
export function signalToTokens(
  _tokensCuratedOnDeployment: BigNumber,
  _reserveRatio: BigNumber,
  _totalVSignal: BigNumber,
  _vSignalIn: BigNumber,
): BigNumber {
  if (_tokensCuratedOnDeployment.lte(ZERO)) {
    console.warn(
      'ERROR: Subgraph deployment must be curated to perform calculations. This would fail on the EVM. We return 0',
    )
    return ZERO
  }
  if (_vSignalIn > _totalVSignal) {
    console.warn(
      'ERROR: Signal must be above or equal to signal issued in the curation pool. This would fail on the EVM. We return 0',
    )
    return ZERO
  }

  const tokensOut = saleTargetAmount(
    _totalVSignal,
    _tokensCuratedOnDeployment,
    _reserveRatio,
    _vSignalIn,
  )
  return tokensOut
}

/**
 * @dev given a vSignal supply, GRT reserve balance, ratio and a deposit amount (in GRT),
 * calculates the vSignal to be returned (i.e minting)
 *
 * Formula:
 * Return = _supply * ((1 + _depositAmount / _reserveBalance) ^ (_reserveRatio / MAX_WEIGHT) - 1)
 *
 * @param _supply              vSignal supply
 * @param _reserveBalance      total GRT reserve balance
 * @param _reserveRatio        reserve ratio, represented in ppm, (i.e. 1 == 1000000)
 * @param _depositAmount       deposit amount, in GRT
 *
 * @return purchase return amount in vSignal
 */
function purchaseTargetAmount(
  _supply: BigNumber,
  _reserveBalance: BigNumber,
  _reserveRatio: BigNumber,
  _depositAmount: BigNumber,
): BigNumber {
  // special case for 0 deposit amount
  if (_depositAmount.eq(ZERO)) return ZERO

  // special case if the weight = 100%
  if (_reserveRatio == MAX_WEIGHT) return _supply.mul(_depositAmount).div(_reserveBalance)

  // normal case
  const supplyD = new Decimal(_supply.toString())
  const amountD = new Decimal(_depositAmount.toString())
  const reserveBalanceD = new Decimal(_reserveBalance.toString())
  let exp: Decimal
  MAX_WEIGHT.eq(_reserveRatio.mul(TWO)) // make it a bit more efficient for current network stats. But can handle a change in default reserve ratio
    ? (exp = new Decimal(0.5))
    : (exp = new Decimal(_reserveRatio.toString()).div(
        new Decimal(MAX_WEIGHT.toString()),
      ))
  const purchaseAmount = supplyD.mul(
    ONE_D.add(amountD.div(reserveBalanceD)).pow(exp).sub(ONE_D),
  )

  return decimalToBN(purchaseAmount)
}

/**
 * @dev given a vSignal supply, GRT reserve balance, ratio and a sellAmount (i.e. burn)
 * in vSignal, calculates the return in GRT
 *
 * Formula:
 * Return = _reserveBalance * (1 - (1 - _sellAmount / _supply) ^ (MAX_WEIGHT / _reserveRatio))
 *
 * @param _supply              token vSignal supply
 * @param _reserveBalance      total GRT reserve balance
 * @param _reserveRatio        reserve ratio, represented in ppm, 1 == 1000000
 * @param _sellAmount          sell amount, in vSignal
 *
 * @return sale return amount in GRT
 */

function saleTargetAmount(
  _supply: BigNumber,
  _reserveBalance: BigNumber,
  _reserveRatio: BigNumber,
  _sellAmount: BigNumber,
): BigNumber {
  // special case for 0 sell amount
  if (_sellAmount.eq(ZERO)) return ZERO

  // special case for selling the entire supply
  if (_sellAmount.eq(_supply)) return _reserveBalance

  // special case if the weight = 100%
  if (_reserveRatio == MAX_WEIGHT) return _reserveBalance.mul(_sellAmount).div(_supply)

  // normal case
  const reserveBalanceD = new Decimal(_reserveBalance.toString())
  const amountD = new Decimal(_sellAmount.toString())
  const supplyD = new Decimal(_supply.toString())
  let exp: Decimal
  MAX_WEIGHT.eq(_reserveRatio.mul(TWO)) // make it a bit more efficient for current network stats. But can handle a change in default reserve ratio
    ? (exp = new Decimal(2))
    : (exp = new Decimal(MAX_WEIGHT.toString()).div(
        new Decimal(_reserveRatio.toString()),
      ))
  const saleAmount = reserveBalanceD.mul(
    ONE_D.sub(ONE_D.sub(amountD.div(supplyD)).pow(exp)),
  )

  return decimalToBN(saleAmount)
}
