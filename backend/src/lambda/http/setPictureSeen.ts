import * as AWS from "aws-sdk";
import * as middy from "middy";
import { cors } from "middy/middlewares";
import { ExecuteStatementRequest } from "aws-sdk/clients/rdsdataservice";
// import { APIGatewayProxyResult, APIGatewayProxyEvent } from "aws-lambda";
import { APIGatewayProxyResult } from "aws-lambda";

import { createLogger } from "../../utils/logger";
// import { v4String } from "uuid/interfaces";

const RDS = new AWS.RDSDataService();
const logger = createLogger("GetDataInRange");

var DBSecretsStoreArn = process.env.SECRET_STORE_ARN;
var DBAuroraClusterArn = process.env.AURORA_CLUSTER_ARN;
var databaseName = process.env.DATABASE_NAME;
var seenTableName = process.env.SEEN_TABLE_NAME;

export const handler = middy(
  //   async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  async (): Promise<APIGatewayProxyResult> => {
    // TODO: Replace Mocked Data
    // const pictureId: v4String = event.pathParameters.pictureId;
    const pictureId: string = "E'c7af6d4d-8a8d-424b-b801-4f487b216495'";
    const userId = 1;

    const setPictureSeenMutation = `
      INSERT INTO ${seenTableName} (SeenBy, PictureId) VALUES (${userId}, ${pictureId});
    `;

    let params: ExecuteStatementRequest = {
      database: databaseName,
      resourceArn: DBAuroraClusterArn,
      secretArn: DBSecretsStoreArn,
      sql: setPictureSeenMutation,
    };

    try {
      let dbResponse = await RDS.executeStatement(params).promise();
      logger.info("Added user to picture seen: ", [
        userId,
        pictureId,
        dbResponse,
      ]);
      return {
        statusCode: 200,
        body: JSON.stringify(dbResponse),
      };
    } catch (error) {
      logger.error(`Error executing sql request: ${error}`);
      return {
        statusCode: 400,
        body: JSON.stringify(error),
      };
    }
  },
);

handler.use(cors({ credentials: true }));
