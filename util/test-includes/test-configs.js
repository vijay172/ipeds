require('dotenv').config();
const AWS = require('aws-sdk');
const proxy = require('proxy-agent');
if (process.env.AWS_PROFILE != 'undefined') {
    const credentials = new AWS.SharedIniFileCredentials({ profile: process.env.AWS_PROFILE });
    AWS.config.credentials = credentials;
} else {
    console.error("no profile found");
    throw new Error("No AWS_PROFILE found");
}

if (typeof process.env.PROXY != 'undefined') {
    AWS.config.update({
        httpOptions: {agent: proxy(process.env.PROXY)}
    });
}
const IAM = new AWS.IAM();
const Metadata = new AWS.MetadataService();

module.exports = {
  // Build API URL
  region: (typeof process.env.AWS_REGION !== 'undefined') ? process.env.AWS_REGION : 'us-east-1',
  stage: (typeof process.env.TEST_STAGE !== 'undefined') ? process.env.TEST_STAGE : 'dev',
  apiVersion: (typeof process.env.TEST_VERSION !== 'undefined') ? process.env.TEST_VERSION : 'v0',

  getAccountID: () => new Promise((resolve, reject) => {
    if (process.env.AWS_ACCOUNT_ID) {
      resolve(process.env.AWS_ACCOUNT_ID);
      return;
    }
    IAM.getUser({}, (err, data) => {
      if (err) {
        Metadata.request('/latest/meta-data/iam/info/', (err2, data2) => {
          if (err2) {
            console.log('Unable to get IAM user', err, err.stack);
            console.log('Unable to request IAM data', err2, err2.stack);
            reject(err2);
          } else {
            console.log('Unable to get IAM user', err, err.stack);
            console.log('Found via requesting IAM data');
            resolve(JSON.parse(data2).InstanceProfileArn.split(':')[4]);
          }
        });
      } else {
        resolve(data.User.Arn.split(':')[4]);
      }
    });
  }),

};
