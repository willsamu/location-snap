import * as AWS from "aws-sdk";
import * as middy from "middy";
import { cors } from "middy/middlewares";
// import { secretsManager } from "middy/middlewares";
import { LocationRequest } from "../requests/LocationRequest";
import { createLogger } from "../utils/logger";
import { ExecuteStatementRequest } from "aws-sdk/clients/rdsdataservice";

const RDS = new AWS.RDSDataService();
const logger = createLogger("SetupPostgresTable");

var DBSecretsStoreArn = process.env.SECRET_STORE_ARN;
var DBAuroraClusterArn = process.env.AURORA_CLUSTER_ARN;
var databaseName = process.env.DATABASE_NAME;
var tableName = process.env.LOCATION_TABLE_NAME;

export const handler = middy(async () => {
  // amcheck,
  //   address_standardizer,
  //   address_standardizer_data_us,
  //   apg_plan_mgmt,
  //   aurora_stat_utils,
  //   aws_commons,
  //   aws_ml,
  //   aws_s3,
  //   bloom,
  //   btree_gin,
  //   btree_gist,
  //   chkpass,
  //   citext,
  //   cube,
  //   dblink,
  //   dict_int,
  //   dict_xsyn,
  //   earthdistance,
  //   fuzzystrmatch,
  //   hll,
  //   hstore,
  //   hstore_plperl,
  //   intagg,
  //   intarray,
  //   ip4r,
  //   isn,
  //   log_fdw,
  //   ltree,
  //   orafce,
  //   pgaudit,
  //   pgcrypto,
  //   pgrouting,
  //   pgrowlocks,
  //   pgstattuple,
  //   pg_buffercache,
  //   pg_freespacemap,
  //   pg_hint_plan,
  //   pg_similarity,
  //   pg_prewarm,
  //   pg_repack,
  //   pg_stat_statements,
  //   pg_trgm,
  //   pg_visibility,
  //   plcoffee,
  //   plls,
  //   plperl,
  //   plpgsql,
  //   plprofiler,
  //   pltcl,
  //   plv8,
  //   postgis,
  //   postgis_tiger_geocoder,
  //   postgis_topology,
  //   postgres_fdw,
  //   prefix,
  //   sslinfo,
  //   tablefunc,
  //   test_parser,
  //   tsearch2,
  //   tsm_system_rows,
  //   tsm_system_time,
  //   unaccent,
  //   uuid - ossp;

  const installExtensions = `
    CREATE EXTENSION IF NOT EXISTS postgis;
    CREATE EXTENSION IF NOT EXISTS postgis_topology;
    CREATE EXTENSION IF NOT EXISTS fuzzystrmatch;
    CREATE EXTENSION IF NOT EXISTS postgis_tiger_geocoder;
    `;

  // The Lambda environment variables for the Aurora Cluster Arn, Database Name, and the AWS Secrets Arn hosting the master credentials of the serverless db

  let params: ExecuteStatementRequest = {
    database: databaseName,
    resourceArn: DBAuroraClusterArn,
    secretArn: DBSecretsStoreArn,
    sql: installExtensions,
  };

  try {
    let dbResponse = await RDS.executeStatement(params).promise();
    logger.info("Installed Extensions: ", dbResponse);
  } catch (error) {
    logger.error(`Error executing Install Extension: ${error}`);
    return { statusCode: 400, body: JSON.stringify(error) };
  }

  const createTable = `
    CREATE TABLE IF NOT EXISTS ${tableName} (
        id SERIAL PRIMARY KEY,
        geom GEOMETRY(Point, 4326),
        name VARCHAR(128)
    );
    
    CREATE INDEX IF NOT EXISTS ${tableName}_gix
    ON ${tableName}
    USING GIST (geom);
    
    INSERT INTO ${tableName} (geom) VALUES (ST_GeomFromText('POINT(0 0)', 4326));

    SELECT id, name
    FROM ${tableName}
    WHERE ST_DWithin(
        geom,
        ST_GeomFromText('POINT(0 0)', 4326), 1000
    );
    `;
  params.sql = createTable;
  try {
    let dbResponse = await RDS.executeStatement(params).promise();
    logger.info("Created Table: ", dbResponse);
    return { statusCode: 200, body: JSON.stringify(dbResponse) }; //TODO: Change return statement
  } catch (error) {
    logger.error(`Error executing sql request: ${error}`);
    return { statusCode: 400, body: JSON.stringify(error) };
  }
});

handler.use(cors({ credentials: true }));
