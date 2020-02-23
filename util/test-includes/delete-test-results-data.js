/**
 * @file delete-test-game-data.js
 * Deletes all Postgres items stored in the results_changelog table.
 * Use: AWS_PROFILE=bonanza-admin node test/delete-test-results-data.js
 */
//require('./test-configs.js');
console.log('entered delete-test-game-data.js');
const _ = require('lodash');
const promiseRetry = require('promise-retry');
const argv = require('yargs').argv;
const commonUtils = require('../../services/base/includes/common-utils');
const standingsModel = require('../../services/base/models/standings');
const util = require('util');

const throttles = {
  results_changelog: 4,
};

// Use: --resultsThrottle=# to change the number of results_changelog deletes per timeout
if (typeof argv.resultsThrottle !== 'undefined') {
  throttles.results_changelog = argv.resultsThrottle;
}

if (typeof process.env.AWS_REGION === 'undefined') {
  process.env.AWS_REGION = 'us-west-2';
}

let eventUnitCodeFull;
// Use: --eventUnitCodeFull=IHOZTEAM6-------------FNL-000100-- for eg. to delete all entries for a specific result
if (typeof argv.eventUnitCodeFull !== 'undefined') {
  eventUnitCodeFull = argv.eventUnitCodeFull;
  console.log('eventUnitCodeFull:', eventUnitCodeFull);
}
//TODO: remove process.env.RESULTS_TABLE = `results_changelog`;


const tableNames = {
  results_changelog: commonUtils.tableNames['results_changelog'],
  standings: commonUtils.tableNames['standings'],
};
const gameModels = {
  pool: commonUtils.createDbPool(),
};

const deleteTimeout = 100;//changed from 1600
console.log('Deleting with a', deleteTimeout, 'millisecond timeout');

const deleteRecursive = (tableInfo, items, throttle) => {
  const subItems = items.splice(0, throttle);
  _.forEach(subItems, (item) => {
    promiseRetry((retry, number) => {
      return new Promise((resolve, reject) => {
        //TODO: delete from PG table
        reject('delete not defined');
        /*tableInfo.model.destroy(params, (err, acc) => {
          if (err) {
            console.log('Error deleting item', err);
            console.log('Retry', number);
            reject(err);
          } else {
            resolve(acc);
          }
        });*/
      }).catch(retry);
    }).then(() => {
    }, (err) => {
      console.log('Retry deleting error', err);
    });
  });

  if (items.length > 0) {
    setTimeout(deleteRecursive, deleteTimeout, tableInfo, items, throttle);
  }
};

const deleteItems = (tableInfo, items) => {
  if (!items && items.length === 0) {
    console.log('No items to delete from', tableInfo.baseName);
    return;
  }
  console.log('Deleting', items.length, 'item(s) from', tableInfo.baseName, throttles[tableInfo.baseName], 'at a time');
  deleteRecursive(tableInfo, items, throttles[tableInfo.baseName]);
};

/**
 * Call Postgres table and get data for eventUnitCodeFull.
 * Then call deleteItems as callback for the table with the data to be deleted.
 * @param tableBase
 * @param callback
 */
const scanTable = (tableBase, callback) => {
  console.log("scanTables with eventUnitCodeFull:%s", eventUnitCodeFull);
  //TODO:
  const table = {
    baseName: tableBase,
    createDbPool: gameModels[tableBase],
  };

  //get data for eventUnitCodeFull
  const items = [];
  //call delete for items on the table
  //callback(table, items);
  //delete that row from results_changelog/standings table
  standingsModel.delete(eventUnitCodeFull).then((val) => {
    console.log('Successfully deleted Row with val:%s', val);
    callback(null);
  });
  console.log('Did not delete Row');
  callback(new Error('Did not delete Row'));//TODO: error here
};

const deleteTableItem = (tableBase, callback) => {
  console.log("deleteTableItem with tableBase:%s eventUnitCodeFull:%s", tableBase, eventUnitCodeFull);
  //TODO:
  //delete that row from results_changelog/standings table
  standingsModel.delete(eventUnitCodeFull).then((val) => {
    console.log('Successfully deleted Row with val:%s', util.inspect(val));
    callback(null);
  }).catch((reason) => {
    console.log('Did not delete Row (' + reason + ') here.');
    callback(new Error('Did not delete Row'));//TODO: error here
  });

};
deleteTableItem(tableNames.standings, function (err) {
  console.log("deleted data with err:%s", err);
});
/*scanTable(tableNames.standings, function (err) {
  console.log("deleted data with err:%s", err);
});*/
//scanTable(tableNames.standings, deleteItems);
