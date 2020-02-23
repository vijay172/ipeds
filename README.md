#Readme#

#To deploy data parser lambda:
1. Inside the base directory, have your lambda_config.json file. Make sure this file has all the info corresponding to
your lambda. Two sample config files are stored in the base directory.
2. Go to the scripts directory
    cd scripts
3. Create an environment variable for your own lambda name.
    export TRUEVR_PARSER_LAMBDA=<your_own_function_name>
    if you are willing to deploy the same function in the future as well, it is better to put this export command inside your bash_profile for global access.
3. (Optional) run create_lambda.sh, if this is the first time you are deploying this lambda.
4. Run build.sh, if you have changed the lambda code or lambda config. This will deploy the lambda directly on the AWS.
5. To trigger the lambda, create an S3 bucket in the AWS and configure it such that when a zip file or an xml file is added to this
bucket, it will trigger your lambda.
6. When both the S3 bucket and the parser lambda are ready, upload a zip file containing DT_Results xml files from BDF.
This upload should automatically trigger the lambda and the lambda should parse the DT_results file and update the
database results table. Same goes for other type of BDF files.

#Logging
Set loggerLevel=debug in the services/base/lambda_config.json or your .env file at the root folder level.
loggerLevel values in increasing severity level are:
info
debug
warn
error
fatal