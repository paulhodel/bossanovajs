class Query {
  instance;
  tableName;
  columns;
  query;

  static debug = false;

  constructor(instance) {
    this.instance = instance;
  }

  prepareStatement(query, statements) {
    Object.entries(statements).forEach((statement) => {
      if (typeof statement[1] === 'number') {
        query = query.replace(`:${statement[0]}`, statement[1]);
      } else if (statement[1] === null || statement[1] === 'null' || statement[1].trim() === '') {
        query = query.replace(`:${statement[0]}`, 'null');
      } else if (statement[1] === 'NOW()') {
        query = query.replace(`:${statement[0]}`, 'NOW()');
      } else if (typeof statement[1] === 'string') {
        const treatedStatement = `'${statement[1].replace("'", '')}'`;
        query = query.replace(`:${statement[0]}`, treatedStatement);
      }
    })

    return query;
  }

  table(tableName) {
    this.tableName = tableName;

    return this;
  }

  column(columns) {
    this.columns = columns;

    return this;
  }

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

    console.log(this.query);

    return this;
  }
}

module.exports = Query