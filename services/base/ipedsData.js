/**
 * @file ipedsData.js
 * Lambda Handler for BDF data getting uploaded to a S3 bucket as a zip file with xml files inside it.
 * Creates and updates various tables like results,rankings,events,event_units,medals_countries, medals_events etc,
 * & stores them.
 */
'use strict';
const aws = require('aws-sdk/index');
const _ = require('lodash');
const ipedsModel = require('./models/venues');
const commonUtils = require('./includes/common-utils');

const async = require('async');
const util = require('util');
const logger = require('./includes/logger');
const headers = { 'Access-Control-Allow-Origin': '*' };


/**
 * Main entry point of the lambda triggered from the S3 bucket
 * @param event
 * @param context
 * @param callback
 */
module.exports.handler = (event, context, callback) => {


  const processRequest = () => {
    logger.debug('before Ipeds Dashboard event method process:', event);
    let eventMethod = event.httpMethod;
    if (!eventMethod) {
      logger.debug('trying event.httpMethod:%s', event.httpMethod);
      eventMethod = event.httpMethod;
    }
    let dbPool = commonUtils.createDbPool();
    logger.debug('dbPool:', util.inspect(dbPool));
    const dict = {};
    // Handle Get & Update http methods
    switch (eventMethod) {
      case 'GET':
      {
        /*let type = '';
        let lastTime = '';
        let lastMaxEntries = 0;
        let queryParm = '';
        logger.debug('event.queryStringParameters[type]:', event.queryStringParameters['type']);
        logger.debug('event.queryStringParameters[lastTime]:', event.queryStringParameters['lastTime']);
        logger.debug('event.queryStringParameters[lastMaxEntries]:', event.queryStringParameters['lastMaxEntries']);
        if (event.queryStringParameters && event.queryStringParameters['type']) {
          type = event.queryStringParameters['type'];
          queryParm = 'type';
          if (type !== 'viz') {
            logger.error('Not an accepted query parm: ' + queryParm + '.');
            return callback(null, {statusCode: 400, headers: headers, body: JSON.stringify({ 'message': 'GET - Not an accepted query parm:' + queryParm }) });
          }
        }
        if (event.queryStringParameters && event.queryStringParameters['lastTime']) {
          lastTime = event.queryStringParameters['lastTime'];
          if (commonUtils.matchLastTime(lastTime)) {
            queryParm = 'lastTime';
          } else {
            logger.error('Not an accepted query parm: ' + lastTime + '.');
            return callback(null, {statusCode: 400, headers: headers, body: JSON.stringify({ 'message': 'GET - Not an accepted query parm:' + lastTime }) });
          }

        }
        if (event.queryStringParameters && event.queryStringParameters['lastMaxEntries']) {
          const lastMaxEntriesStr = event.queryStringParameters['lastMaxEntries'];
          if (isNormalInteger(lastMaxEntriesStr)) {
            lastMaxEntries = Math.floor(Number(lastMaxEntriesStr));
            queryParm = 'lastMaxEntries';
          } else {
            logger.error('Not an accepted query parm: ' + lastMaxEntries + '.');
            return callback(null, {statusCode: 400, headers: headers, body: JSON.stringify({ 'message': 'GET - Not an accepted query parm:' + lastMaxEntriesStr }) });
          }
        }
        let dict = {};
        dict.database = "ipeds";
        switch (queryParm) {
          case 'type':
            dict.type = type;
            break;
          case 'lastTime':
            dict.lastTime = lastTime;
            break;
          case 'lastMaxEntries':
            dict.lastMaxEntries = lastMaxEntries;
            break;
          default:
            logger.error('Not an accepted query parm: ' + queryParm + '.');
            return callback(null, {statusCode: 400, headers: headers, body: JSON.stringify({ 'message': 'GET - Not an accepted query parm: ' + queryParm }) });

        }*/

        ipedsModel.get(dbPool, dict).then((val) => {
          //const valJson = JSON.parse(val);
          logger.debug('GET ipeds', val);
          context.callbackWaitsForEmptyEventLoop = false;// important to return from lambda
          return callback(null, {statusCode: 200, headers: headers, body: JSON.stringify(val) });
        }).catch((err) => {
          logger.error('GET ipeds error:%s', err);
          context.callbackWaitsForEmptyEventLoop = false;// important to return from lambda
          return callback(null, {statusCode: 500, headers: headers, body: JSON.stringify({ 'message': 'Error getting ipeds for queryParm' }) });
        });

        break;
      }
      default:
      {
        callback(null, {statusCode: 400,body: JSON.stringify({ 'message': 'Unsupported verb:' + eventMethod }) });
      }
    }
  };


  processRequest();
};
