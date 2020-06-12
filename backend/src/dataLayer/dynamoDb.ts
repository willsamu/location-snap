import * as AWS from "aws-sdk";
import { DocumentClient } from "aws-sdk/clients/dynamodb";

const dataTable = process.env.PICTURE_DATA_TABLE;

const docClient: DocumentClient = new AWS.DynamoDB.DocumentClient();

export async function addImageToDynamo(newImageObject: any) {
  await docClient
    .put({
      TableName: dataTable,
      Item: newImageObject,
    })
    .promise();
  return newImageObject;
}
