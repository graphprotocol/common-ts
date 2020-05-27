import { createAttestation } from './attestations'
import { Wallet } from 'ethers'
import { hexlify } from 'ethers/utils'
import * as bs58 from 'bs58'

describe('Attestations', () => {
  test('attestations are correct', async () => {
    let mnemonic =
      'coyote tattoo slush ball cluster culture bleak news when action cover effort'

    let receipt = {
      requestCID: '0xd902c18a1b3590a3d2a8ae4439db376764fda153ca077e339d0427bf776bd463',
      responseCID: '0xbe0b5ae5f598fdf631133571d59ef16b443b2fe02e35ca2cb807158069009db9',
      subgraphID: hexlify(
        bs58.decode('QmTXzATwNfgGVukV1fX2T6xw9f6LAYRVWpsdXyRWzUR2H9').slice(2),
      ),
    }

    let signer = Wallet.fromMnemonic(mnemonic)
    let attestation = await createAttestation(
      signer.privateKey,
      1,
      '0x0000000000000000000000000000000000000000',
      receipt,
    )

    expect(attestation).toStrictEqual({
      requestCID: receipt.requestCID,
      responseCID: receipt.responseCID,
      subgraphID: receipt.subgraphID,
      v: 27,
      r: '0x888890e355b6a8239b39bdb2ce1b6642e59fc5591ecaece4ae5704883aa63419',
      s: '0x625445ed8831ca150f47742dd2925a413227cf5972fddf0549d33253ff1587c9',
    })
  })
})
