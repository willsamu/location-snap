import * as AWS from "aws-sdk";
import * as middy from "middy";
import { cors } from "middy/middlewares";
import { ExecuteStatementRequest } from "aws-sdk/clients/rdsdataservice";
import { APIGatewayProxyResult, APIGatewayProxyEvent } from "aws-lambda";

import { createLogger } from "../../utils/logger";
import { getUserId } from "../utils";

const RDS = new AWS.RDSDataService();
const logger = createLogger("GetDataInRange");

var DBSecretsStoreArn = process.env.SECRET_STORE_ARN;
var DBAuroraClusterArn = process.env.AURORA_CLUSTER_ARN;
var databaseName = process.env.DATABASE_NAME;
var seenTableName = process.env.SEEN_TABLE_NAME;

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const userId = getUserId(event);
    const pictureId = event.pathParameters.pictureId;

    // ? Validate Input
    const v4 = new RegExp(
      /^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i,
    );
    const validInput = pictureId.match(v4);
    logger.info("Input: ", { userId, pictureId, validInput });
    if (!validInput)
      return {
        statusCode: 422,
        body: JSON.stringify("Caught your injection!"),
      };

    const setPictureSeenMutation = `
      INSERT INTO ${seenTableName} (SeenBy, PictureId) VALUES ($id$${userId}$id$, $id$${pictureId}$id$);
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
