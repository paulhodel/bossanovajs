class Query {
  instance;
  tableName;
  columns;
  query;
  arguments;
  whereText;

  static debug = false;

  constructor(instance) {
    this.instance = instance;
  }

  /**
   * Inserts values into a sql query.
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
   * Keep the table reference name to assembly the query.
   * @param {string} tableName - Table name.
   */
  table(tableName) {
    this.tableName = tableName;

    return this;
  }

  /**
   * Keep the colums names to assembly the query.
   * @param {string | Object} columns - String for Select or object for Insert and Updates.
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
   * Keep the array of arguments to assembly the where in the query.
   * @param {string} column - Column name.
   * @param {number | string} value - Comparison or the value to be compared.
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
}

module.exports = Query