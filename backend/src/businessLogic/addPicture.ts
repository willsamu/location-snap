import { createLogger } from "../utils/logger";
import { createImageRequest } from "../requests/createImageRequest";
import { addImageToDynamo } from "../dataLayer/dynamoDb";
import { getUploadUrl } from "../dataLayer/s3";

const logger = createLogger("AddPicture");

export async function createImage(
  userId: string,
  pictureId: string,
  newImage: createImageRequest,
) {
  const createdAt = new Date().toISOString();

  const newImageObject = {
    userId,
    timestamp: createdAt,
    pictureId,
    ...newImage,
  };
  logger.info("Storing new item: ", newImageObject);

  await addImageToDynamo(newImageObject);

  const uploadUrl = getUploadUrl(pictureId);

  return { newImageObject, uploadUrl };
}
