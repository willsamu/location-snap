import * as middy from "middy";
import { cors } from "middy/middlewares";
import { v4 as uuid } from "uuid";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { createImageRequest } from "../../requests/createImageRequest";
import { getUserId } from "../utils";
import { createImage } from "../../businessLogic/addPicture";

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const userId = getUserId(event);
    const pictureId = uuid();
    const newImage: createImageRequest = JSON.parse(event.body);

    const result = await createImage(userId, pictureId, newImage);

    return {
      statusCode: 201,
      body: JSON.stringify(result),
    };
  },
);

handler.use(cors({ credentials: true }));
