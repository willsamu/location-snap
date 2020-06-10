import * as AWS from "aws-sdk";
import * as https from "https";

const sslAgent = new https.Agent({
  keepAlive: true,
  maxSockets: 50,
  rejectUnauthorized: true,
});

AWS.config.update({ httpOptions: { agent: sslAgent } });
let RDS = null;
if (!RDS) RDS = new AWS.RDSDataService();

export async function ExecuteDataApiStatement(params: any) {
  let dbResponse = await RDS.executeStatement(params).promise();
  return dbResponse;
}
