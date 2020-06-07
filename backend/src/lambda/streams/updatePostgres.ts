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

const RDS = new AWS.RDSDataService();
const logger = createLogger("WriteLocationToPostgres");

var DBSecretsStoreArn = process.env.SECRET_STORE_ARN;
var DBAuroraClusterArn = process.env.AURORA_CLUSTER_ARN;
var databaseName = process.env.DATABASE_NAME;
var tableName = process.env.LOCATION_TABLE_NAME;

export const handler = middy(async (event) => {
  //TODO: add event type
  console.log(JSON.stringify(event, null, 2)); // Log the entire event passed in

  const userId = 1; // TODO: Add dynamic id
  const locationObject = { lat: "54", lon: "55" };
  const geolocation = validateInput(locationObject);
  if (!geolocation)
    return {
      statusCode: 409,
      body: `E R R O R processing input${locationObject}`,
    };

  var sqlStatement = `SELECT * FROM ${tableName}`;

  // The Lambda environment variables for the Aurora Cluster Arn, Database Name, and the AWS Secrets Arn hosting the master credentials of the serverless db

  const params = {
    awsSecretStoreArn: DBSecretsStoreArn,
    dbClusterOrInstanceArn: DBAuroraClusterArn,
    sqlStatements: sqlStatement,
    database: databaseName,
  };
  console.log(
    `Params:${JSON.stringify(
      params,
    )} \nuserId: ${userId}, geoLocation: ${JSON.stringify(geolocation)}`,
  );

  try {
    let dbResponse = await RDS.executeStatement(params);
    logger.info("Response Object: ", dbResponse);
    // logger.info("Recieved response from Postgres: ", {
    //   result: JSON.stringify(dbResponse, null, 2),
    // });
    // return { statusCode: 200, body: JSON.stringify(dbResponse) }; //TODO: Change return statement
    return { statusCode: 200, body: dbResponse }; //TODO: Change return statement
  } catch (error) {
    logger.error(`Error executing sql request: ${error}`);
    return { statusCode: 400, body: error };
  }
});

// handler.use(
//   secretsManager({
//     awsSdkOptions: { region: "us-east-1" },
//     cache: true,
//     cacheExpiryInMillis: 60000,
//     // Throw an error if can't read the secret
//     throwOnFailedCall: true,
//     secrets: {
//       AUTH0_SECRET: secretId,
//     },
//   }),
// );

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
