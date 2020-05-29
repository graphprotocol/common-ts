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
      r: '0x10994d2f62aa72f2103b7e1df984b020962092a76ad5e8de418e89d0f41bfdb7',
      s: '0x25c22a538c531c1062821909b9af94166dfe9357c968c20bcc26ec6feb9e315e',
    })
  })
})
