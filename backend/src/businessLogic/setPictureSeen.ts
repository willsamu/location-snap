import { ExecuteStatementRequest } from "aws-sdk/clients/rdsdataservice";
import { getDownloadUrl } from "../dataLayer/s3";
import { ExecuteDataApiStatement } from "../dataLayer/PostgresAccess";
import { createLogger } from "../utils/logger";

const logger = createLogger("GetDataInRange");

const DBSecretsStoreArn = process.env.SECRET_STORE_ARN;
const DBAuroraClusterArn = process.env.AURORA_CLUSTER_ARN;
const databaseName = process.env.DATABASE_NAME;
const seenTableName = process.env.SEEN_TABLE_NAME;

export async function setPicture(userId: string, pictureId: string) {
  const setPictureSeenMutation = `
      INSERT INTO ${seenTableName} (SeenBy, PictureId) VALUES ($id$${userId}$id$, $id$${pictureId}$id$);
    `;

  let params: ExecuteStatementRequest = {
    database: databaseName,
    resourceArn: DBAuroraClusterArn,
    secretArn: DBSecretsStoreArn,
    sql: setPictureSeenMutation,
  };
  logger.info("Input", { params, userId, pictureId });

  const result = await ExecuteDataApiStatement(params);

  const imageUrl = getDownloadUrl(pictureId);

  return { result, imageUrl };
}
