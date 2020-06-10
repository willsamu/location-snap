// import * as AWS from "aws-sdk";
// import * as middy from "middy";
// import { cors } from "middy/middlewares";
// import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
// import { createLogger } from "../../utils/logger";

// const dataTable = process.env.PICTURE_DATA_TABLE;

// const docClient = new AWS.DynamoDB.DocumentClient();
// const logger = createLogger("AddPicture");

// // TODO: Add Request Validator

// export const handler = middy(
//   async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
//     // TODO: Replace Mocked Data
//     const pictureId = event.pathParameters.pictureId;

//     logger.info("Request: ", { pictureId });
//     const imageQueryResult = await getImageData(pictureId);

//     return {
//       statusCode: 201,
//       body: JSON.stringify({
//         item: imageQueryResult,
//       }),
//     };
//   },
// );

// async function getImageData(pictureId: string) {
//   const result = await docClient
//     .get({
//       TableName: dataTable,
//       Key: {
//         pictureId,
//       },
//     })
//     .promise();
//   logger.info("Result to be returned: ", result);
// }

// handler.use(cors({ credentials: true }));
