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
var locationTableName = process.env.LOCATION_TABLE_NAME;
var seenTableName = process.env.SEEN_TABLE_NAME;

export const handler = middy(
  async (): Promise<APIGatewayProxyResult> => {
    const installExtensions = `
    CREATE EXTENSION IF NOT EXISTS postgis;
    CREATE EXTENSION IF NOT EXISTS postgis_topology;
    CREATE EXTENSION IF NOT EXISTS fuzzystrmatch;
    CREATE EXTENSION IF NOT EXISTS postgis_tiger_geocoder;
    CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
    CREATE EXTENSION IF NOT EXISTS btree_gist;
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
      return {
        statusCode: 400,
        body: `Error during extension installation.. ${JSON.stringify(error)}`,
      };
    }

    const createTable = `
    CREATE TABLE IF NOT EXISTS ${locationTableName} (
        PictureId uuid,
        geom GEOMETRY(Point, 4326)
    );
    
    CREATE INDEX IF NOT EXISTS ${locationTableName}_gix ON ${locationTableName} USING GIST (geom);
    
    CREATE TABLE IF NOT EXISTS ${seenTableName} (
        id SERIAL PRIMARY KEY,
        PictureId uuid,
        SeenBy VARCHAR(64)
    );
    
    CREATE INDEX IF NOT EXISTS ${seenTableName}_gix ON ${seenTableName} USING GIST (PictureId);
    `;

    params.sql = createTable;

    try {
      let dbResponse = await RDS.executeStatement(params).promise();
      logger.info("Created Tables!", dbResponse);
      return { statusCode: 200, body: "" };
    } catch (error) {
      logger.error(`Error executing sql request: ${error}`);
      return {
        statusCode: 400,
        body: `Error executing SQL requests... ${JSON.stringify(error)}`,
      };
    }
  },
);

handler.use(cors({ credentials: true }));
