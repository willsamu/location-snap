import * as AWS from "aws-sdk";
import * as middy from "middy";
import { cors } from "middy/middlewares";
import { ExecuteStatementRequest } from "aws-sdk/clients/rdsdataservice";
import { APIGatewayProxyResult, APIGatewayProxyEvent } from "aws-lambda";

import { createLogger } from "../../utils/logger";
import { LocationRequest } from "../../requests/LocationRequest";

const RDS = new AWS.RDSDataService();
const logger = createLogger("GetDataInRange");

var DBSecretsStoreArn = process.env.SECRET_STORE_ARN;
var DBAuroraClusterArn = process.env.AURORA_CLUSTER_ARN;
var databaseName = process.env.DATABASE_NAME;
var locationTableName = process.env.LOCATION_TABLE_NAME;
var seenTableName = process.env.SEEN_TABLE_NAME;

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    // const parameter = event.body;
    console.log(
      "E V E N T:\n",
      event.body,
      validateInput({ lat: "54", lon: "55" }),
    );
    // TODO: Replace Mocked Data
    // const userLocation: LocationRequest = JSON.parse(event.body);
    const userLocation: LocationRequest = { lat: "54", lon: "55" };
    const rangeInMeter = 10 ** 4;
    const userId = "1";

    const getDataInRange = `
      SELECT PictureId FROM ${locationTableName} 
      WHERE
        ST_DWithin(geom, ST_MakePoint(${userLocation.lat}, ${userLocation.lon})::geography, ${rangeInMeter})
        AND 
        NOT EXISTS (
          SELECT 1
          FROM ${seenTableName}
          WHERE
            ${seenTableName}.PictureId = ${locationTableName}.PictureId
            AND
            ${seenTableName}.SeenBy = ${userId}::VARCHAR(64)
        )
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
      logger.info("Result: ", dbResponse);
      return { statusCode: 200, body: JSON.stringify(dbResponse) };
    } catch (error) {
      logger.error(`Error executing sql request: ${error}`);
      return { statusCode: 400, body: JSON.stringify(error) };
    }
  },
);

const validateInput = (locationObject: LocationRequest) => {
  try {
    const latitude = parseFloat(locationObject.lat);
    if (latitude > 180 || latitude < 0)
      throw new Error(`Invalid Latitude input!`);
    const longitude = parseFloat(locationObject.lon);
    if (longitude > 90 || longitude < 0)
      throw new Error("Invalid Longitude input!");
    return { latitude: latitude.toString(), longitude: longitude.toString() };
  } catch (e) {
    return null;
  }
};

handler.use(cors({ credentials: true }));
