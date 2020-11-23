import 'source-map-support/register';
import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda';
import { getAllLikes } from '../../businessLogic/feeds';
import { createLogger } from '../../utils/logger';

const logger = createLogger('getAllLikes');

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const feedItemId = event.pathParameters.id;
  if (!feedItemId) {
    return {
      statusCode: 400,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({
        error: `Feed item ID is reeuired.`
      })
    };
  }

  logger.info('Getting all likes of a feed item ...');

  // Get all likes of a feed item
  const likes = await getAllLikes(feedItemId);

  return {
    statusCode: 200,
    headers: { 'Access-Control-Allow-Origin': '*' },
    body: JSON.stringify({
      items: likes,
      count: likes.length
    })
  };
}
