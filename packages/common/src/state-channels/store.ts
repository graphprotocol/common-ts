import * as Sequelize from 'sequelize'
import { Store, StorePair } from '@connext/types'

class Record extends Sequelize.Model {
  static initialize(sequelize: Sequelize.Sequelize) {
    Record.init(
      {
        path: {
          type: Sequelize.STRING,
          primaryKey: true,
        },
        value: {
          type: Sequelize.JSONB,
          allowNull: false,
        },
      },
      { sequelize },
    )
  }
}

export class SequelizeConnextStore implements Store {
  sequelize: Sequelize.Sequelize

  constructor(sequelize: Sequelize.Sequelize) {
    this.sequelize = sequelize

    Record.initialize(sequelize)
  }

  async set(pairs: StorePair[], shouldBackup: boolean): Promise<void> {
    throw 'Unimplemented'
  }

  async get(path: string): Promise<any> {
    throw 'Unimplemented'
  }

  async restore(): Promise<StorePair[]> {
    throw 'Unimplemented'
  }
}
