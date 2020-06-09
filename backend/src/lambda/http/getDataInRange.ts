import * as AWS from "aws-sdk";
import * as middy from "middy";
import { cors } from "middy/middlewares";
import { ExecuteStatementRequest } from "aws-sdk/clients/rdsdataservice";
import { APIGatewayProxyResult, APIGatewayProxyEvent } from "aws-lambda";
import * as https from "https";

import { createLogger } from "../../utils/logger";
import { LocationRequest } from "../../requests/LocationRequest";
import { DataInRange } from "../../models/DataInRange";
import { getUserId } from "../utils";

const sslAgent = new https.Agent({
  keepAlive: true,
  maxSockets: 50,
  rejectUnauthorized: true,
});

AWS.config.update({ httpOptions: { agent: sslAgent } });

let RDS = null;

if (!RDS) RDS = new AWS.RDSDataService();

const logger = createLogger("GetDataInRange");

var DBSecretsStoreArn = process.env.SECRET_STORE_ARN;
var DBAuroraClusterArn = process.env.AURORA_CLUSTER_ARN;
var databaseName = process.env.DATABASE_NAME;
var locationTableName = process.env.LOCATION_TABLE_NAME;
var seenTableName = process.env.SEEN_TABLE_NAME;

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    // TODO: Replace Mocked Data

    const userLocation: LocationRequest = validateInput(event);
    if (!userLocation)
      return {
        statusCode: 400,
        body: "Invalid/Malformed Location Data Input",
      };

    const rangeInMeter = userLocation.range * 10 ** 3;
    const userId = getUserId(event);
    logger.info("Request passed: ", [userLocation, userId]);

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

    try {
      let dbResponse = await RDS.executeStatement(params).promise();
      logger.info("Result: ", { request: params, response: dbResponse });

      return {
        statusCode: 200,
        body: JSON.stringify(transformResult(dbResponse)),
      };
    } catch (error) {
      logger.error(`Error executing sql request: ${error}`);
      return { statusCode: 400, body: JSON.stringify(error) };
    }
  },
);
/**
 * @description Validates Request Input and Prevents SQL Injection
 */
function validateInput(event: APIGatewayProxyEvent): LocationRequest {
  try {
    const range = parseInt(event.queryStringParameters.range, 10);
    const lat = event.queryStringParameters.lat;
    const lon = event.queryStringParameters.lon;
    if (!(range || lat || lon)) return null;
    logger.info("Recieved parameters", { range, lat, lon });

    const latitude = parseFloat(lat);
    if (latitude > 180 || latitude < -180)
      throw new Error(`Invalid Latitude input!`);
    const longitude = parseFloat(lon);
    if (longitude > 90 || longitude < -90)
      throw new Error("Invalid Longitude input!");
    if (range < 0) throw new Error("Invalid Request Range");
    return {
      lat: latitude.toString(),
      lon: longitude.toString(),
      range: range,
    };
  } catch (e) {
    logger.error(`INPUT ERROR: ${e}`);
    return null;
  }
}

function transformResult(
  response: AWS.RDSDataService.ExecuteStatementResponse,
) {
  if (response.records && response.records.length > 0) {
    const body: DataInRange = [];
    for (let record of response.records) {
      body.push({
        id: record[0].stringValue,
        distance: (record[1].doubleValue / 1000) | 0, // Parse as integer
      });
    }
    return body;
  }
  return [];
}

handler.use(cors({ credentials: true }));
