import { SubgraphDeploymentID, SubgraphNameOrDeploymentID } from '.'

describe('Subgraph deployment IDs', () => {
  test('Type safety', () => {
    const original = '0x4d31d21d389263c98d1e83a031e8fed17cdcef15bd62ee8153f34188a83c7b1c'
    const id: SubgraphNameOrDeploymentID = new SubgraphDeploymentID(original)

    // This wouldn't compile if TypeScript didn't recognize `id` having
    // kind == 'deployment-id'
    expect(id.bytes32).toEqual(original)
  })

  test('Conversion from bytes32', () => {
    const original = '0x4d31d21d389263c98d1e83a031e8fed17cdcef15bd62ee8153f34188a83c7b1c'
    const id = new SubgraphDeploymentID(original)

    expect(`${id}`).toEqual(original)
    expect(id.bytes32).toEqual(original)
    expect(id.ipfsHash).toEqual('QmTXzATwNfgGVukV1fX2T6xw9f6LAYRVWpsdXyRWzUR2H9')

    const original2 = '0x32c4e64f2b5ecfedbcd41c1d1c469f837d2f3f4f9cdaff496fc7332d92090449'
    const id2 = new SubgraphDeploymentID(original2)

    expect(id2.bytes32).toEqual(original2)
    expect(id2.ipfsHash).toEqual('QmRkqEVeZ8bRmMfvBHJvoB4NbnPgXNcuszLZWNNF49skY8')
  })

  test('Conversion from IPFS hash', () => {
    const original = 'QmTXzATwNfgGVukV1fX2T6xw9f6LAYRVWpsdXyRWzUR2H9'
    const id = new SubgraphDeploymentID(original)

    expect(`${id}`).toEqual(
      '0x4d31d21d389263c98d1e83a031e8fed17cdcef15bd62ee8153f34188a83c7b1c',
    )
    expect(id.bytes32).toEqual(
      '0x4d31d21d389263c98d1e83a031e8fed17cdcef15bd62ee8153f34188a83c7b1c',
    )
    expect(id.ipfsHash).toEqual(original)

    const original2 = 'QmRkqEVeZ8bRmMfvBHJvoB4NbnPgXNcuszLZWNNF49skY8'
    const id2 = new SubgraphDeploymentID(original2)

    expect(`${id2}`).toEqual(
      '0x32c4e64f2b5ecfedbcd41c1d1c469f837d2f3f4f9cdaff496fc7332d92090449',
    )
    expect(id2.bytes32).toEqual(
      '0x32c4e64f2b5ecfedbcd41c1d1c469f837d2f3f4f9cdaff496fc7332d92090449',
    )
    expect(id2.ipfsHash).toEqual(original2)
  })
})
