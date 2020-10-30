const PostgreConnection = require('./PostgreConnection');
const MysqlConnection = require('./MysqlConnection');

class Connection {
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
  static async getConnection({ type, ...dbSettings }) {
    if (type === 'postgre') {
      return PostgreConnection.getConnection(dbSettings);
    }

    if (type === 'mysql') {
      return MysqlConnection.getConnection(dbSettings);
    }

    throw new Error('Unrecognized type');
  }
}

module.exports = Connection;