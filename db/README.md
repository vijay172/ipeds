## PSQL Database schema creation and initialization##
1. First of all, ssh to a jump box EC2 instance from where your PSQL database is accessible.
2. Fill in the db_config file with all necessary configuration values. Then run the following script:
    ./build_database.sh
This script will create the schema and all the required tables inside the specified schema only if the schema and tables
were not present. 
