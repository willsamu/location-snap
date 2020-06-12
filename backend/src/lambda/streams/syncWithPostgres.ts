import * as middy from "middy";
import { cors } from "middy/middlewares";
import { createLogger } from "../../utils/logger";
import { DynamoDBStreamEvent } from "aws-lambda";
import { syncData } from "../../businessLogic/syncWithPostgres";

const logger = createLogger("WriteLocationToPostgres");

export const handler = middy(async (event: DynamoDBStreamEvent) => {
  logger.info("Processing events batch from DynamoDB", JSON.stringify(event));
  for (const record of event.Records) {
    console.log("Processing record", JSON.stringify(record));
    if (record.eventName !== "INSERT") {
      continue;
    }
    await syncData(record);
  }
});

handler.use(cors({ credentials: true }));
