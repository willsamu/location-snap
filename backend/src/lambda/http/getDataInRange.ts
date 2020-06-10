import * as AWS from "aws-sdk";
import * as middy from "middy";
import { cors } from "middy/middlewares";
import { APIGatewayProxyResult, APIGatewayProxyEvent } from "aws-lambda";

import { LocationRequest } from "../../requests/LocationRequest";
import { DataInRange } from "../../models/DataInRange";
import { getUserId } from "../utils";
import { getData } from "../../businessLogic/getDataInRange";
import { DataApiResponse } from "../../models/DataApiResponse";

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const userLocation: LocationRequest = validateInput(event);
    if (!userLocation)
      return {
        statusCode: 400,
        body: "Invalid/Malformed Location Data Input",
      };

    const rangeInMeter = userLocation.range * 10 ** 3;
    const userId = getUserId(event);

    const result = (await getData(
      userLocation,
      rangeInMeter,
      userId,
    )) as DataApiResponse;

    if (result.error) {
      return {
        statusCode: 400,
        body: JSON.stringify(result.error),
      };
    }
    return {
      statusCode: 200,
      body: JSON.stringify({ items: transformResult(result.dbResponse) }),
    };
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
