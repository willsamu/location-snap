import * as AWS from "aws-sdk";
import * as middy from "middy";
import { cors } from "middy/middlewares";
import { v4 as uuid } from "uuid";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { createImageRequest } from "../../requests/createImageRequest";
import { createLogger } from "../../utils/logger";

const dataTable = process.env.PICTURE_DATA_TABLE;
const pictureBucket = process.env.PICTURE_BUCKET;
const urlExpirationTime = process.env.URL_EXPIRATION_TIME;

const docClient = new AWS.DynamoDB.DocumentClient();
const s3 = new AWS.S3({
  signatureVersion: "v4",
});
const logger = createLogger("AddPicture");

// TODO: Add Request Validator

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    // TODO: Replace Mocked Data
    const userId = "1";

    const pictureId = uuid();
    const newImageObject = await createImage(userId, pictureId, event);

    const uploadUrl = getUploadUrl(pictureId);
    logger.info("Data to be returned:");

    return {
      statusCode: 201,
      body: JSON.stringify({
        newImageObject,
        uploadUrl,
      }),
    };
  },
);

async function createImage(
  userId: string,
  pictureId: string,
  event: APIGatewayProxyEvent,
) {
  const createdAt = new Date().toISOString();
  const newImage: createImageRequest = JSON.parse(event.body);

  const newImageObject = {
    userId,
    timestamp: createdAt,
    pictureId,
    ...newImage,
    imageUrl: `https://${pictureBucket}.s3.amazonaws.com/${pictureId}`,
  };
  console.log("Storing new item: ", newImageObject);

  await docClient
    .put({
      TableName: dataTable,
      Item: newImageObject,
    })
    .promise();

  return newImageObject;
}

function getUploadUrl(pictureId: string) {
  return s3.getSignedUrl("putObject", {
    Bucket: pictureBucket,
    Key: pictureId,
    Expires: parseInt(urlExpirationTime, 10),
  });
}

handler.use(cors({ credentials: true }));
