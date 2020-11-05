class PostgreAdapter {
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
    const { Client } = require('pg');

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
   * @param {string} query - The sql to be executed.
   */
  async query(query) {
    return this.connection.query(query)
      .then(({ rows, rowCount }) => {
        if (rows.length === 0) {
          return rowCount;
        }
        return rows;
      })
      .catch((err) => {
        throw new Error(err.message);
      });
  }

  async getPrimaryKey(table) {
    return this.query(`
      SELECT a.attname as column_name
      FROM pg_index i
      JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
      WHERE i.indrelid = '${table}'::regclass AND i.indisprimary;
    `);
  }

  async lastInsertedId(sequenceName) {
    return this.query(`SELECT CURRVAL('${sequenceName}');`).then((result) => result[0].currval);
  }
}

module.exports = PostgreAdapter;