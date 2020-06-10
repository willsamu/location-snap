import * as middy from "middy";
import { cors } from "middy/middlewares";
import { APIGatewayProxyResult, APIGatewayProxyEvent } from "aws-lambda";

import { createLogger } from "../../utils/logger";
import { getUserId } from "../utils";
import { setPicture } from "../../businessLogic/setPictureSeen";
import { SetPictureResponse } from "../../models/DataApiResponse";
const logger = createLogger("GetDataInRange");

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const userId = getUserId(event);
    const pictureId = event.pathParameters.pictureId;

    const v4 = new RegExp(
      /^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i,
    );
    const validInput = pictureId.match(v4);
    logger.info("Input: ", { userId, pictureId, validInput });
    if (!validInput)
      return {
        statusCode: 422,
        body: JSON.stringify("Caught your injection Paul!"),
      };
    const response = (await setPicture(
      userId,
      pictureId,
    )) as SetPictureResponse;

    if (response.result.error) {
      return {
        statusCode: 400,
        body: JSON.stringify(response.result.error),
      };
    }
    return {
      statusCode: 200,
      body: JSON.stringify({
        event: response.result,
        url: response.imageUrl,
      }),
    };
  },
);

handler.use(cors({ credentials: true }));
