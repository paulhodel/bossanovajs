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
   */
  async query(query) {
    return this.connection.query(query)
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

  async getPrimaryKey(table) {
    return this.query(`
    SELECT column_name as column_name
    FROM information_schema.table_constraints t
    JOIN information_schema.key_column_usage k
    USING(constraint_name,table_schema,table_name)
    WHERE t.constraint_name='PRIMARY' AND t.table_schema='${this.connection.connection.config.database}' AND t.table_name='${table}';
    `);
  }

  async lastInsertedId() {
    return this.query('SELECT LAST_INSERT_ID();').then((result) => result[0]['LAST_INSERT_ID()']);
  }
}

module.exports = MysqlAdapter;