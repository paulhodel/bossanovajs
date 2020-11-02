class MysqlAdapter {
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
    const mysql = require('mysql2/promise');

    const connection = await mysql.createConnection({
      host,
      port,
      user,
      password,
      database: name
    });

    connection.config.namedPlaceholders = true;

    this.connection = connection;
  }

  /**
   * This method executes sql queries.
   * @public
   * @param {string} query - The sql to be executed.
   * @param {object} values - The values to be inserted in the query.
   */
  async query(query, values) {
    return this.connection.query(query, values)
      .then((result) => {
        if (result[0].affectedRows || result[0].affectedRows === 0) {
          return result[0].affectedRows;
        }
        return result[0];
      })
      .catch((err) => {
        throw new Error(err.message);
      });
  }
}

module.exports = MysqlAdapter;