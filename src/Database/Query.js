class Query {
  instance;
  tableName;
  columns;
  query;
  arguments;
  whereText;
  params;
  join;
  groupStatement;
  havingStatement;
  orderStatement;
  limitStatement;
  offsetStatement;

  static debug = false;

  constructor(instance) {
    this.instance = instance;
  }

  /**
   * Inserts values into a sql query.
   * @private
   * @param {string} query - The query where the values should be inserted.
   * @param {Object} statements - the values to be inserted.
   */
  prepareStatement(query, statements) {
    Object.entries(statements).forEach((statement) => {
      if (typeof statement[1] === 'number') {
        query = query.replace(`:${statement[0]}`, statement[1]);
      } else if (statement[1] === null || statement[1] === 'null' || statement[1].trim() === '') {
        query = query.replace(`:${statement[0]}`, 'null');
      } else if (statement[1] === 'NOW()') {
        query = query.replace(`:${statement[0]}`, 'NOW()');
      } else if (typeof statement[1] === 'string') {
        const treatedStatement = `'${statement[1].replace(/'/g, '')}'`;
        query = query.replace(`:${statement[0]}`, treatedStatement);
      }
    })

    return query;
  }

  /**
   * Keep the table reference name to assembly the query
   * @param {string} tableName - Table name.
   */
  table(tableName) {
    this.tableName = tableName;

    return this;
  }

  /**
   * Keep the colums names to assembly the query.
   * @param {string | string[] | Object} columns - String or array of strings for Select, and object for Insert and Updates.
   */
  column(columns) {
    this.columns = columns;

    return this;
  }

  /**
   * Assembly a new INSERT usign all definitions.
   */
  insert() {
    let names = '';
    let values = '';

    Object.entries(this.columns).forEach((column) => {
      if (column[1] === '') {
        column[1] = 'null';
      }

      if (names !== '') {
        names += ', ';
      }

      names += column[0];

      if (values !== '') {
        values += ', ';
      }

      values += `:${column[0]}`;
    })

    const query = 'INSERT INTO ' + this.tableName + ' (' + names + ') VALUES(' + values + ')';

    this.query = this.prepareStatement(query, this.columns);

    return this;
  }

  /**
   * Assembly a new INSERT usign all definitions and return the complete INSERT SQL.
   */
  getInsert() {
    this.insert();

    return this.query;
  }

  /**
   * Bind params and save query.
   * @param {string} query - Query to be changed.
   * @param {Object} value - Values to be inserted in the query.
   */
  bindParam(query, value) {
    if (!this.params) {
      this.params = [];
    }

    if (!this.arguments) {
      this.arguments = [];
    }

    query = this.prepareStatement(query, value);

    this.arguments.push(query);

    return this;
  }

  /**
   * Keep the array of arguments to assembly the where in the query.
   * @param {string} column - Column name.
   * @param {number | string} value - Comparation or the value to be compared.
   * @param {string} operator - Operator (default is an equal).
   */
  argument(column, value, operator = '=') {
    if (!this.arguments) {
      this.arguments = [];
    }

    this.arguments.push(`${column} ${operator} ${value}`);

    return this;
  }

  /**
   * Assembly the where with the arguments saved.
   * @param {string} text - Logical argument distribution in the where, ex. ((1) OR (2)) AND (3).
   */
  where(text) {
    if (text) {
      if (this.arguments) {
        text = text.replace(/\(/g, '[[');
        text = text.replace(/\)/g, ']]');

        this.arguments.forEach((argument, index) => {
          text = text.replace(`[[${index}]]`, argument);
        })

        text = text.replace(/\[\[/g, '(');
        text = text.replace(/]]/g, ')');

        this.whereText = text;
      }
    } else {
      text = '';

      if (this.arguments && this.arguments.length) {
        this.arguments.forEach((argument) => {
          if (text) {
            text += ' AND ';
          }

          text += argument;
        })
      }

      this.whereText = text;
    }

    return this;
  }

  /**
   * Keep the left join string to assembly the query.
   * @param {string} tableName - Table name to be used in the join.
   * @param {string} comparation - Comparation to be used at the join.
   */
  leftJoin(tableName, comparation) {
    if (!this.join) {
      this.join = '';
    }

    this.join += ` LEFT JOIN ${tableName} ON (${comparation})`;

    return this;
  }

  /**
   * Keep the right join string to assembly the query.
   * @param {string} tableName - Table name to be used in the join.
   * @param {string} comparation - Comparation to be used at the join.
   */
  rightJoin(tableName, comparation) {
    if (!this.join) {
      this.join = '';
    }

    this.join += ` RIGHT JOIN ${tableName} ON (${comparation})`;

    return this;
  }

  /**
   * Keep the inner join string to assembly the query.
   * @param {string} tableName - Table name to be used in the join.
   * @param {string} comparation - Comparation to be used at the join.
   */
  innerJoin(tableName, comparation) {
    if (!this.join) {
      this.join = '';
    }

    this.join += ` INNER JOIN ${tableName} ON (${comparation})`;

    return this;
  }

  /**
   * Keep the group by string to assembly the query.
   * @param {string} value - Column(s) name(s) to be used in the 'group by' statement.
   */
  group(value) {
    this.groupStatement = value;

    return this;
  }

  /**
   * Keep the having by string to assembly the query.
   * @param {string} value - Condition to be used in the 'having' statement.
   */
  having(value) {
    this.havingStatement = value;

    return this;
  }

  /**
   * Keep the order by string to assembly the query.
   * @param {string} value - Column(s) name(s) to be used in the 'order by' statement.
   */
  order(value) {
    this.orderStatement = value;

    return this;
  }

  /**
   * Keep the limit by string to assembly the query.
   * @param {number} value - Number to be used in the 'limit' statement.
   */
  limit(value) {
    this.limitStatement = value;

    return this;
  }

  /**
   * Keep the offset by string to assembly the query.
   * @param {number} value - Number to be used in the 'offset' statement.
   */
  offset(value) {
    this.offsetStatement = value;

    return this;
  }

  /**
   * Define a manual query to be executed.
   * @param {string} query - Query to be executed.
   */
  setQuery(query) {
    this.query = query;

    return this;
  }

  /**
   * Return the query already in this instance.
   */
  getQuery() {
    return this.query ? this.query : '';
  }

  /**
   * Assembly a new SELECT usign all definitions.
   */
  select() {
    if (!this.columns) {
      this.query = 'SELECT *';
    } else {
      if (Array.isArray(this.columns)) {
        this.columns = this.columns.join(', ');
      }

      this.query = `SELECT ${this.columns}`;
    }

    if (!this.whereText) {
      if (this.arguments && this.arguments.length) {
        this.where();
      }
    }

    if (this.tableName) {
      this.query += ` FROM ${this.tableName}`;
    }

    if (this.join) {
      this.query += `${this.join}`;
    }

    if (this.whereText) {
      this.query += ` WHERE ${this.whereText}`;
    }

    if (this.groupStatement) {
      this.query += ` GROUP BY ${this.groupStatement}`;
    }

    if (this.havingStatement) {
      this.query += ` HAVING ${this.havingStatement}`;
    }

    if (this.orderStatement) {
      this.query += ` ORDER BY ${this.orderStatement}`;
    }

    if (this.limitStatement) {
      this.query += ` LIMIT ${this.limitStatement}`;
    }

    if (this.offsetStatement) {
      this.query += ` OFFSET ${this.offsetStatement}`;
    }

    return this;
  }

  /**
   * Assembly a new SELECT usign all definitions and return the complete SELECT SQL.
   */
  getSelect() {
    this.select();

    return this.query;
  }

  /**
   * Assembly a new UPDATE usign all definitions.
   */
  update() {
    let updateStatement = '';

    Object.entries(this.columns).forEach((column) => {
      if (updateStatement !== '') {
        updateStatement += ', ';
      }

      console.log(column)
      updateStatement += `${column[0]} = ${column[1]}`;
    })

    this.query = `UPDATE ${this.tableName} SET ${updateStatement}`;

    if (!this.whereText) {
      if (this.arguments && this.arguments.length) {
        this.where();
      }
    }

    if (this.whereText) {
      this.query += ` WHERE ${this.whereText}`;
    }

    return this;
  }

  /**
   * Assembly a new UPDATE usign all definitions and return the complete UPDATE SQL.
   */
  getUpdate() {
    this.update();

    return this.query;
  }

  /**
   * Assembly a new DELETE usign all definitions.
   */
  delete() {
    this.query = `DELETE FROM ${this.tableName}`;

    if (!this.whereText) {
      if (this.arguments && this.arguments.length) {
        this.where();
      }
    }

    if (this.whereText) {
      this.query += ` WHERE ${this.whereText}`;
    }

    return this;
  }

  /**
   * Assembly a new DELETE usign all definitions and return the complete DELETE SQL.
   */
  getDelete() {
    this.delete();

    return this.query;
  }

  async execute(debug = 0) {
    if (!this.query) {
      this.select();
    }

    let result;

    let error;

    console.log(this.query)
    return this.instance.query(this.query)
  }

  /**
   * Get the primary key from the defined table.
   * @param {string} table - table name.
   */
  async getPrimaryKey(table) {
    return this.instance.getPrimaryKey(table);
  }
}

module.exports = Query