#!/bin/bash -u

source db_config

: "${DB_HOST:?You must set DB_HOST}"
: "${DB_PORT:?You must set DB_PORT}"
: "${DB_USER:?You must set DB_USER}"
: "${DB_PASSWORD:?You must set DB_PASSWORD}"
: "${DB_NAME:?You must set DB_NAME}"
: "${DB_SCHEMA:?You must set DB_SCHEMA}"

psql postgresql://$DB_USER:$DB_PASSWORD@$DB_HOST:$DB_PORT/$DB_NAME -v SCHEMA_NAME=$DB_SCHEMA -f create_tables.sql

echo "Done with creating the db schema"
