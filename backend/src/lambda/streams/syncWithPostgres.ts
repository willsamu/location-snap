// As of April 25, 2019 --> Make sure to call $ 'npm install aws-sdk' to package this function before deploying to Lambda as the RDSDataService API is currently in BETA and
// therefore not available in the default aws-sdk included in the Node 8 engine built into Lambda.
// This code uses RDSDataService API for connecting to a Data API enabled Aurora Serverless database: https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/RDSDataService.html
// Call this function with: { "sqlStatement": "SELECT * FROM <YOUR-TABLE-NAME"}
// Deploy this Lambda function via CloudFormation here: https://github.com/mobilequickie/rds-aurora-mysql-serverless

import * as AWS from "aws-sdk";
import * as middy from "middy";
import { cors } from "middy/middlewares";
// import { secretsManager } from "middy/middlewares";
import { LocationRequest } from "../../requests/LocationRequest";
import { createLogger } from "../../utils/logger";
import { ExecuteStatementRequest } from "aws-sdk/clients/rdsdataservice";
import { DynamoDBStreamEvent } from "aws-lambda";

const RDS = new AWS.RDSDataService();
const logger = createLogger("WriteLocationToPostgres");

var DBSecretsStoreArn = process.env.SECRET_STORE_ARN;
var DBAuroraClusterArn = process.env.AURORA_CLUSTER_ARN;
var databaseName = process.env.DATABASE_NAME;
var tableName = process.env.LOCATION_TABLE_NAME;

export const handler = middy(async (event: DynamoDBStreamEvent) => {
  logger.info("Processing events batch from DynamoDB", JSON.stringify(event));
  for (const record of event.Records) {
    console.log("Processing record", JSON.stringify(record));
    if (record.eventName !== "INSERT") {
      continue;
    }
    const newItem = record.dynamodb.NewImage;

    const pictureId = newItem.pictureId.S;
    const lat = newItem.lat.S;
    const lon = newItem.lon.S;

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

    try {
      let dbResponse = await RDS.executeStatement(params).promise();
      logger.info("Response Object: ", dbResponse);
      return {
        statusCode: 200,
        body: dbResponse,
      }; //TODO: Change return statement
    } catch (error) {
      logger.error(`Error executing sql request: ${error}`);
      return {
        statusCode: 400,
        body: error,
      };
    }
  }
});

handler.use(cors({ credentials: true }));
