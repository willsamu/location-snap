import * as AWS from "aws-sdk";

const s3 = new AWS.S3({
  signatureVersion: "v4",
});

const pictureBucket = process.env.PICTURE_BUCKET;
const urlExpirationTime = process.env.URL_EXPIRATION_TIME;

export function getUploadUrl(pictureId: string) {
  return s3.getSignedUrl("putObject", {
    Bucket: pictureBucket,
    Key: pictureId,
    Expires: parseInt(urlExpirationTime, 10),
  });
}

export function getDownloadUrl(pictureId: string) {
  return s3.getSignedUrl("getObject", {
    Bucket: pictureBucket,
    Key: pictureId,
    Expires: 20,
  });
}
