class DatabaseManager {
  /**
   * The database instances.
   */
  instances = {};

  /**
   * @private
   * The variable responsible for the singleton pattern.
   */
  static singleton = null;

  /**
   * @private
   */
  constructor() { }

  /**
   * This method creates an instance of orm.
   */
  static getOrmInstance() {
    if (!DatabaseManager.singleton) {
      DatabaseManager.singleton = new DatabaseManager();
    }

    return DatabaseManager.singleton;
  }

  /**
   * This method creates an instance of a database adapter.
   * @param {string} id - The id of this instance.
   * @param {Function} DatabaseAdapter - The adapter of this instance.
   */
  getDatabaseInstance(id, DatabaseAdapter) {
    if (typeof DatabaseAdapter !== 'function') {
      throw new Error('Invalid DatabaseAdapter');
    }
    this.instances[id] = new DatabaseAdapter();
  }
}

module.exports = DatabaseManager;