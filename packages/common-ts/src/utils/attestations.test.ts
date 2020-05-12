import { createSignedAttestation } from './attestations'
import { Wallet } from 'ethers'
import { hexlify } from 'ethers/utils'
import * as bs58 from 'bs58'

describe('Attestations', () => {
  test('signed attestations are correct', async () => {
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
    let attestation = await createSignedAttestation(
      signer,
      1,
      '0x0000000000000000000000000000000000000000',
      receipt,
    )

    expect(attestation).toStrictEqual({
      requestCID: receipt.requestCID,
      responseCID: receipt.responseCID,
      subgraphID: receipt.subgraphID,
      v: 27,
      r: '0x406f6cc3857a1f94ae0f51fa2c50a24306c0e0165f6816871c1b7ce45ab45449',
      s: '0x4d80d68aa70e191140e24ae6bb2b7acb170cbae1b44a49a4f0f0a63780fb7951',
    })
  })
})
