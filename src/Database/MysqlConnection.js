const mysql = require('mysql2/promise');

class MysqlConnection {
  /**
   * @private
   * @property {object} - The connection to the mysql database.
   */
  connection;

  /**
   * This method establishes a connection to the mysql database.
   * @public
   * @param {object} dbSettings - The database settings.
   * @param {string} dbSettings.host - The database host.
   * @param {string} dbSettings.port - The database port.
   * @param {string} dbSettings.user - The database user.
   * @param {string} dbSettings.password - The database password.
   * @param {string} dbSettings.name - The database name.
   */
  async getConnection({ host, port, user, password, name }) {
    const connection = await mysql.createConnection({
      host,
      port,
      user,
      password,
      database: name
    });

    this.connection = connection;
  }

  /**
   * This method executes sql queries.
   * @public
   * @param {string} value - The sql to be executed.
   */
  async query(value) {
    return this.connection.query(value)
      .then((result) => {
        if (result[0].affectedRows || result[0].affectedRows === 0) {
          return result[0].affectedRows
        }
        return result[0];
      })
      .catch((err) => {
        throw new Error(err.message)
      });
  }
}

module.exports = MysqlConnection;