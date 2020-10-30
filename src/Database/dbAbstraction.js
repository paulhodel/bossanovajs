const PostgreConnection = require('./PostgreConnection');
const MysqlConnection = require('./MysqlConnection');

class Connection {
  /**
   * @private
   * @property {object} - The instance of the class that has a connection to the database.
   */
  database;

  constructor() {
  }

  /**
   * This method identifies the type of the database and returns a connection to it.
   * @public
   * @param {object} dbSettings - The database settings.
   * @param {string} dbSettings.type - The database type.
   * @param {string} dbSettings.host - The database host.
   * @param {string} dbSettings.port - The database port.
   * @param {string} dbSettings.user - The database user.
   * @param {string} dbSettings.password - The database password.
   * @param {string} dbSettings.name - The database name.
   */
  async getConnection({ type, ...dbSettings }) {
    if (type === 'postgre') {
      this.database = new PostgreConnection();
    }

    if (type === 'mysql') {
      this.database = new MysqlConnection();
    }

    if (this.database === null) {
      throw new Error('Unrecognized type');
    } else {
      await this.database.getConnection(dbSettings);
    }
  }

  /**
   * This method executes sql queries.
   * @public
   * @param {string} value - The sql to be executed.
   */
  async query(value) {
    return this.database.query(value);
  }
}

module.exports = Connection;