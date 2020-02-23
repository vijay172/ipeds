#!/bin/bash
FUNCTIONNAME=$1
echo $FUNCTIONNAME
cp -r ../services/base/ ./build
cd build/
npm install
rm -f $FUNCTIONNAME.zip
zip -r $FUNCTIONNAME.zip $FUNCTIONNAME.js models includes node_modules

#aws lambda create-function --region us-east-1 --cli-input-json file://lambda_config.json --zip-file fileb://$FUNCTIONNAME.zip
