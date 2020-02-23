#!/bin/bash
FUNCTIONNAME=$1
echo $FUNCTIONNAME
if [ ! -d build ]; then
    mkdir build
fi
cp -r ../services/base/ ./build
cd build/
npm install
rm -f $FUNCTIONNAME.zip
zip -r $FUNCTIONNAME.zip $FUNCTIONNAME.js models includes node_modules

echo "Done building the nodejs package."
echo "Generating githash of commit"
echo "Update environment variable for GITHASH"
GITHASH=$(git rev-parse HEAD)
GITHASH_SHORT=$(git rev-parse --short HEAD)
echo "GITHASH $GITHASH"
echo "GITHASH_SHORT $GITHASH_SHORT"
sed 's/#GITHASH#/'$GITHASH'/; s/#GITHASH_SHORT#/'$GITHASH_SHORT'/' lambda_config.json > lambda_config1.json
echo "Update environment variables from lambda-config"
aws lambda update-function-configuration --region us-east-1 --cli-input-json file://lambda_config1.json
echo "Updated lambda config."
aws lambda update-function-code --region us-east-1 --function-name $FUNCTIONNAME  --zip-file fileb://$FUNCTIONNAME.zip
echo "Updated lambda code on aws. $FUNCTIONNAME Lambda has been deployed successfully."
