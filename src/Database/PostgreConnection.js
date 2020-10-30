const { Client } = require('pg');

class PostgreConnection {
  /**
   * This method creates and returns a connection to the postgre database.
   * @public
   * @param {object} dbSettings - The database settings.
   * @param {string} dbSettings.host - The database host.
   * @param {string} dbSettings.port - The database port.
   * @param {string} dbSettings.user - The database user.
   * @param {string} dbSettings.password - The database password.
   * @param {string} dbSettings.name - The database name.
   */
  static async getConnection({ host, port, user, password, name }) {
    const client = new Client({
      host,
      port,
      user,
      password,
      database: name
    });

    await client.connect();

    return client;
  }
}

module.exports = PostgreConnection;