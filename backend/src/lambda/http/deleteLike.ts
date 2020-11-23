import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { deleteLikeById } from '../../businessLogic/feeds';
import { createLogger } from '../../utils/logger';

const logger = createLogger('deleteLike');

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const likeId = event.pathParameters.id;
  if (!likeId) {
    return {
      statusCode: 400,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({
        error: `Like ID is reeuired.`
      })
    };
  }

  logger.info(`Removing a like with the Id '${likeId}' ...`);

  // Remove a like by id
  if (await deleteLikeById(likeId) !== true) {

    logger.error(`No like with the Id '${likeId}' exist`);

    return {
      statusCode: 404,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({
        error: `No like with the Id '${likeId}' exist`
      })
    };
  }

  logger.info(`Like with the Id '${likeId}' removed sucessfully`);

  return {
    statusCode: 200,
    headers: { 'Access-Control-Allow-Origin': '*' },
    body: ''
  };
}