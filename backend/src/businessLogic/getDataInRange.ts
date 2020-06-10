import { LocationRequest } from "../requests/LocationRequest";
import { createLogger } from "../utils/logger";
import { ExecuteStatementRequest } from "aws-sdk/clients/rdsdataservice";
import { ExecuteDataApiStatement } from "../dataLayer/PostgresAccess";

const logger = createLogger("GetDataInRange");

var DBSecretsStoreArn = process.env.SECRET_STORE_ARN;
var DBAuroraClusterArn = process.env.AURORA_CLUSTER_ARN;
var databaseName = process.env.DATABASE_NAME;
var locationTableName = process.env.LOCATION_TABLE_NAME;
var seenTableName = process.env.SEEN_TABLE_NAME;

export async function getData(
  userLocation: LocationRequest,
  rangeInMeter: number,
  userId: string,
) {
  logger.info("Request passed: ", { userLocation, userId, rangeInMeter });

  const getDataInRange = `
      SELECT PictureId, ST_Distance(geom, ST_MakePoint(${userLocation.lat}, ${userLocation.lon})::geography) FROM ${locationTableName} 
      WHERE
        ST_DWithin(geom, ST_MakePoint(${userLocation.lat}, ${userLocation.lon})::geography, ${rangeInMeter})
        AND 
        NOT EXISTS (
          SELECT 1
          FROM ${seenTableName}
          WHERE
            ${seenTableName}.PictureId = ${locationTableName}.PictureId
            AND
            ${seenTableName}.SeenBy = $id$${userId}$id$::VARCHAR(64)
        )
      LIMIT 100  
      ;  
    `;

  let params: ExecuteStatementRequest = {
    database: databaseName,
    resourceArn: DBAuroraClusterArn,
    secretArn: DBSecretsStoreArn,
    sql: getDataInRange,
  };

  let response = await ExecuteDataApiStatement(params);
  logger.info("Result: ", { request: params, response });
  return response;
}
