var AWS = require('aws-sdk'),
    fs = require('fs'),
    _ = require('lodash'),
    Q = require('q');

//require('string-format');

var removeFileQ = function (fileName) {
    console.log("[s3_uploader] >> [removeFileQ] deleting file: ", fileName);
    return Q.ninvoke(fs, "unlink", fileName);
};


exports.uploadToS3Q = function (sourceFilePath, s3Bucket, s3Key, expirationSeconds) {

    var deferred = Q.defer();
    var awsS3Service = new AWS.S3();//TODO: S3(config.s3Service.options) options
  /*
  config.s3Service.options = {
            accessKeyId: '...',
            secretAccessKey: '...',
            apiVersion: 'latest',
            region: 'us-east-1'
        }
   */

    var readStream = fs.createReadStream(sourceFilePath);

    var params = {
        Bucket: s3Bucket, //TODO: process.env.s3Bucket
        Key: s3Key,
        Body: readStream
    };

    if (expirationSeconds !== undefined) {
        var expirationDate = new Date();
        expirationDate.setSeconds(expirationDate.getSeconds() + expirationSeconds);
        params.Expires = expirationDate;
    }

    awsS3Service.upload(params, function(errorUploadingFile, details) {
        if (errorUploadingFile) {
            console.error("[s3_uploader] >> [uploadToS3Q] >> Error uploading file to AWS S3 ", errorUploadingFile);
          deferred.reject(new Error(errorUploadingFile));
        } else {
          console.log("[s3_uploader] >> [uploadToS3Q] >> File uploaded successfully to AWS S3", details);
          deferred.resolve(details);
        }

    });

    return deferred.promise;
};
