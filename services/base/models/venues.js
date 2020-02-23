const util = require('util');
//require('dotenv').config();
const logger = require('../includes/logger');
const _ = require('lodash'),
  uuid = require('uuid'),
  mysql = require('mysql');

const schema = process.env.PGSCHEMA;

module.exports = {



  get:
    (connection, dict) => {
      logger.info('get from  table with dict:%s', util.inspect(dict));
      /*let id = '';
      if (dict.id) {
        id = dict.id;
      }
      let type = '';
      if (dict.type) {
        type = dict.type;
      }
      let parameterName = '';
      if (dict.parameterName) {
        parameterName = dict.parameterName + '%';
      }
      logger.info('id:%s, type:%s, parameterName:%s',
        id, type, parameterName);*/
      let qry1 = '';
      const valuesArr = [];
      qry1 = `
          SELECT unitid, IGRNT_N, IGRNT_P, AGRNT_N, AGRNT_P,OFGRT_N,OFGRT_P,OFGRT_A,UAGRNTN,UAGRNTP,UAGRNTA,AGRNT_T,OFGRT_T,SGRNT_T, IGRNT_T
          FROM samplehack order by UAGRNTP desc
          LIMIT 20
          `;
      /*if (id) {
        logger.debug('Inside id query');
        qry1 = `
          SELECT id, type, parameters, storage_location, created_by, created_on, updated_by, updated_on
          FROM ${schema}.samplehack WHERE id = $1
          LIMIT 1
          `;
        valuesArr[0] = id;
      } else if (parameterName) {
        logger.debug('Inside parameterName query');
        qry1 = `
          SELECT id, type, parameters->>'parameter', storage_location, created_by, created_on, updated_by, updated_on
          FROM ${schema}.venue_metadata WHERE parameters->>'parameter'->>'parameterName' = $1
          ORDER BY updated_on DESC LIMIT 1
          `;
        valuesArr[0] = parameterName;
      }

      */
      return new Promise((resolve, reject) => {
        connection.query(`
          ${qry1}
          `, function (error, results, fields) {
          if (error) {
            throw error;
          }
          logger.debug('no err in getting venue table with result: %s', util.inspect(results));
          logger.debug('The solution is: ', results);
          resolve(results);//TODO: handle empty row
        });

      });
    },

  /**
   * Delete venue_metadata based on id
   * @param pool
   * @param dict
   * @returns {Promise<any>}
   */
  delete:
    (pool, dict) => {
      logger.debug('delete venue table with dict:%s', util.inspect(dict));
      const id = dict.id;
      const valuesArr = [];
      valuesArr[0] = id;
      return new Promise((resolve, reject) => {
        pool.query(`DELETE FROM ${schema}.venue_metadata
        WHERE id = $1
        `, valuesArr, (err, result) => {
          if (err) {
            logger.error('Delete venue error:', err);
            return reject(err);
          }
          logger.debug('Successfully deleted rows with dict:%s', util.inspect(dict));
          logger.info('Deleted venue row with %s rows deleted.', result ? result.rowCount : 0);
          logger.debug('result:%s', util.inspect(result));
          let msg = 'No rows are deleted for id:' + id;
          if (result.rowCount > 0) {
            msg = 'Successfully deleted ' + result.rowCount + ' row/s for id:' + id + ' type:' + type;
          }

          return resolve(msg);
        });
      });
    },

};
