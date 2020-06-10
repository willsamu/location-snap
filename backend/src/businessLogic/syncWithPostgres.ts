import { ExecuteDataApiStatement } from "../dataLayer/PostgresAccess";
import { ExecuteStatementRequest } from "aws-sdk/clients/rdsdataservice";
import { DynamoDBRecord } from "aws-lambda";
import { createLogger } from "../utils/logger";

const logger = createLogger("WriteLocationToPostgres");

var DBSecretsStoreArn = process.env.SECRET_STORE_ARN;
var DBAuroraClusterArn = process.env.AURORA_CLUSTER_ARN;
var databaseName = process.env.DATABASE_NAME;
var tableName = process.env.LOCATION_TABLE_NAME;

export async function syncData(record: DynamoDBRecord) {
  const newItem = record.dynamodb.NewImage;

  const pictureId = newItem.pictureId.S;
  const lat = newItem.lat.N;
  const lon = newItem.lon.N;

  const sqlStatement = `
    INSERT
    INTO ${tableName} (geom, PictureId)
    VALUES (ST_SetSRID(ST_MakePoint(${lat}, ${lon}),4326), '${pictureId}')
    ;`;

  const params: ExecuteStatementRequest = {
    database: databaseName,
    resourceArn: DBAuroraClusterArn,
    secretArn: DBSecretsStoreArn,
    sql: sqlStatement,
  };
  const result = await ExecuteDataApiStatement(params);
  logger.info("Execution Result", result);
}
