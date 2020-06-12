import { decode } from "jsonwebtoken";

import { JwtPayload } from "./JwtPayload";

const bucketName = process.env.PICTURE_BUCKET;
const region = process.env.AWS_REGION;

/**
 * Parse a JWT token and return a user id
 * @param jwtToken JWT token to parse
 * @returns a user id from the JWT token
 */
export function parseUserId(jwtToken: string): string {
  const decodedJwt = decode(jwtToken) as JwtPayload;
  return decodedJwt.sub;
}

/**
 * @description Returns a valid url to access corresponding file of todo-task
 * @param  {string} todoId
 * @returns string
 */
export function getAttachmentUrl(todoId: string): string {
  return `https://${bucketName}.s3.${region}.amazonaws.com/${todoId}`;
}

/**
 * @description Wraps certificate key in PSM header and footer
 * @param  {string} key
 * @returns {string} certificate
 */
export function formatToPsm(cert: string): string {
  return `-----BEGIN CERTIFICATE-----\n${cert}\n-----END CERTIFICATE-----`;
}
