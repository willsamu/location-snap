import { CustomAuthorizerEvent, CustomAuthorizerResult } from "aws-lambda";
import "source-map-support/register";

import { verify, decode } from "jsonwebtoken";
import { createLogger } from "../../utils/logger";
import Axios from "axios";
import { Jwt } from "../../auth/Jwt";
import { JwtPayload } from "../../auth/JwtPayload";
import { JwtToken } from "../../models/JwtToken";
import { Auth0Response } from "../../models/Auth0Response";
import { formatToPsm } from "../../auth/utils";

const logger = createLogger("auth");

const jwksUrl = "https://lambda-todo.eu.auth0.com/.well-known/jwks.json"; //TODO: Replace with your url
let certificate: string = ""; // cache certificate

export const handler = async (
  event: CustomAuthorizerEvent,
): Promise<CustomAuthorizerResult> => {
  logger.info("Authorizing a user", event.authorizationToken);
  try {
    const jwtToken = await verifyToken(event.authorizationToken);
    logger.info("User was authorized", jwtToken);

    return {
      principalId: jwtToken.sub,
      policyDocument: {
        Version: "2012-10-17",
        Statement: [
          {
            Action: "execute-api:Invoke",
            Effect: "Allow",
            Resource: "*",
          },
        ],
      },
    };
  } catch (e) {
    logger.error("User not authorized", { error: e.message });

    return {
      principalId: "user",
      policyDocument: {
        Version: "2012-10-17",
        Statement: [
          {
            Action: "execute-api:Invoke",
            Effect: "Deny",
            Resource: "*",
          },
        ],
      },
    };
  }
};

async function verifyToken(authHeader: string): Promise<JwtPayload> {
  const tokenHeader = getToken(authHeader);
  const jwt: Jwt = decode(tokenHeader, { complete: true }) as Jwt;

  if (!certificate) {
    const response = await Axios.get(jwksUrl);
    const publicData: Auth0Response = response.data as Auth0Response;
    certificate = formatToPsm(publicData.keys[0].x5c[0]);
  }

  if (jwt.header.alg !== "RS256")
    throw new Error(`Invalid algorithm! (${jwt.header.alg})`);

  logger.info("About to validate Token");

  return verify(tokenHeader, certificate, {
    algorithms: ["RS256"],
  }) as JwtToken;
}

export function getToken(authHeader: string): string {
  if (!authHeader) throw new Error("No authentication header");

  if (!authHeader.toLowerCase().startsWith("bearer "))
    throw new Error("Invalid authentication header");

  const split = authHeader.split(" ");
  const token = split[1];

  return token;
}
