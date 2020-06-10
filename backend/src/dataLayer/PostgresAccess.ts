import * as AWS from "aws-sdk";
import * as https from "https";
import { DataApiResponse } from "../models/DataApiResponse";

const sslAgent = new https.Agent({
  keepAlive: true,
  maxSockets: 50,
  rejectUnauthorized: true,
});

AWS.config.update({ httpOptions: { agent: sslAgent } });
let RDS = null;
if (!RDS) RDS = new AWS.RDSDataService();

export async function ExecuteDataApiStatement(
  params: any,
): Promise<DataApiResponse> {
  try {
    let dbResponse = await RDS.executeStatement(params).promise();
    return { dbResponse, error: null };
  } catch (error) {
    return { dbResponse: null, error };
  }
}
