
const mysql = require('mysql');
const logger = require('./logger');

module.exports = {
  tableNames : {
    results_changelog: 'results_changelog',
    standings: 'standings',
    rankings: 'rankings',
    medal_countries: 'medals_countries'
  },

  /**
   * Convert to an Array if a JSON Object
   * @param items
   * @param items
   */
  convertToArray: (items) => {
    //console.log('convertToArray items:', items);
    if (Array.isArray(items)) {
      logger.debug('items is already an array of items');
    } else if (typeof items === 'object') {
      items = Array(items)
    }
    return items;
  },

  /**
   * Define the result model
   */
  createDbPool: () => {
    //mysql -h hackathon-mysql.c4uvnrk4flaf.us-east-1.rds.amazonaws.com -u admin -p
    let connection = mysql.createConnection({
      host     : 'hackathon-mysql.c4uvnrk4flaf.us-east-1.rds.amazonaws.com',
      user     : 'admin',
      password : 'hackathon123!',
      database : 'iped'
    });

    connection.connect();
    return connection;
    // Define the Result model& create a config to configure both pooling behavior
    // and client options
    // note: all config is optional and the environment variables
    // will be read if the config is not present
    /*let config = {
      user: process.env.PGUSER, //env var: PGUSER
      database: process.env.PGDATABASE, //env var: PGDATABASE
      password: process.env.PGPASSWORD, //env var: PGPASSWORD
      host: process.env.PGHOST, // Server hosting the postgres database
      port: process.env.PGPORT, //env var: PGPORT default 5432
      max: 10, // max number of clients in the pool
      idleTimeoutMillis: 30000, // how long a client is allowed to remain idle before being closed
    };*/

  }


};
