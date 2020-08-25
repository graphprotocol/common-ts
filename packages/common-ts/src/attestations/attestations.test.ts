import { createAttestation } from './attestations'
import { Wallet } from 'ethers'
import { utils } from 'ethers'
import * as bs58 from 'bs58'

describe('Attestations', () => {
  test('Attestations are correct', async () => {
    const mnemonic =
      'coyote tattoo slush ball cluster culture bleak news when action cover effort'

    const receipt = {
      requestCID: '0xd902c18a1b3590a3d2a8ae4439db376764fda153ca077e339d0427bf776bd463',
      responseCID: '0xbe0b5ae5f598fdf631133571d59ef16b443b2fe02e35ca2cb807158069009db9',
      subgraphDeploymentID: utils.hexlify(
        bs58.decode('QmTXzATwNfgGVukV1fX2T6xw9f6LAYRVWpsdXyRWzUR2H9').slice(2),
      ),
    }

    const signer = Wallet.fromMnemonic(mnemonic)
    const attestation = await createAttestation(
      signer.privateKey,
      1,
      '0x0000000000000000000000000000000000000000',
      receipt,
    )

    expect(attestation).toStrictEqual({
      requestCID: receipt.requestCID,
      responseCID: receipt.responseCID,
      subgraphDeploymentID: receipt.subgraphDeploymentID,
      v: 27,
      r: '0x00bd2f5c3dd7a81dc36a6bf109e4deba55220c0badd5d6e2e1b3aefb48d647e4',
      s: '0x34ca501c609bef062785671d594be732ef7af1ddbaffd8f3257a2ad606479769',
    })
  })
})
