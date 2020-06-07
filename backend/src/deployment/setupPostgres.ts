import * as AWS from "aws-sdk";
import * as middy from "middy";
import { cors } from "middy/middlewares";
import { ExecuteStatementRequest } from "aws-sdk/clients/rdsdataservice";
import { APIGatewayProxyResult } from "aws-lambda";

import { createLogger } from "../utils/logger";

const RDS = new AWS.RDSDataService();
const logger = createLogger("SetupPostgresTable");

var DBSecretsStoreArn = process.env.SECRET_STORE_ARN;
var DBAuroraClusterArn = process.env.AURORA_CLUSTER_ARN;
var databaseName = process.env.DATABASE_NAME;
var tableName = process.env.LOCATION_TABLE_NAME;

export const handler = middy(
  async (): Promise<APIGatewayProxyResult> => {
    const installExtensions = `
    CREATE EXTENSION IF NOT EXISTS postgis;
    CREATE EXTENSION IF NOT EXISTS postgis_topology;
    CREATE EXTENSION IF NOT EXISTS fuzzystrmatch;
    CREATE EXTENSION IF NOT EXISTS postgis_tiger_geocoder;
    `;

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
    
    CREATE INDEX IF NOT EXISTS ${tableName}_gix ON ${tableName} USING GIST (geom);
    
    INSERT INTO ${tableName} (geom,name) VALUES (ST_GeomFromText('POINT(0 1)', 4326), 'Hello World');

    SELECT id, name FROM ${tableName} WHERE ST_DWithin(geom, ST_GeomFromText('POINT(0 0)', 4326), 1000);
    `;

    params.sql = createTable;
    try {
      let dbResponse = await RDS.executeStatement(params).promise();
      logger.info("Created Table!", dbResponse);
      return { statusCode: 200, body: "" };
    } catch (error) {
      logger.error(`Error executing sql request: ${error}`);
      return { statusCode: 400, body: JSON.stringify(error) };
    }
  },
);

handler.use(cors({ credentials: true }));
