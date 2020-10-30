const { Client } = require('pg');

class PostgreConnection {
  /**
   * @private
   * @property {object} - The connection to the postgre database.
   */
  connection;

  constructor() {
  }

  /**
   * This method establishes a connection to the postgres database.
   * @public
   * @param {object} dbSettings - The database settings.
   * @param {string} dbSettings.host - The database host.
   * @param {string} dbSettings.port - The database port.
   * @param {string} dbSettings.user - The database user.
   * @param {string} dbSettings.password - The database password.
   * @param {string} dbSettings.name - The database name.
   */
  async getConnection({ host, port, user, password, name }) {
    const client = new Client({
      host,
      port,
      user,
      password,
      database: name
    });

    await client.connect();

    this.connection = client;
  }

  /**
   * This method executes sql queries.
   * @public
   * @param {string} value - The sql to be executed.
   */
  async query(value) {
    return this.connection.query(value)
      .then(({ rows, rowCount }) => {
        if (rows.length === 0) {
          return rowCount
        }
        return rows
      })
      .catch((err) => {
        throw new Error(err.message)
      });
  }
}

module.exports = PostgreConnection;