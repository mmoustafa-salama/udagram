import 'source-map-support/register';
import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda';
import { getAllComments } from '../../businessLogic/feeds';
import { createLogger } from '../../utils/logger';

const logger = createLogger('getAllComments');

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

  logger.info('Getting all comments of a feed item ...');

  // Get all comments of a feed item
  const comments = await getAllComments(feedItemId);

  return {
    statusCode: 200,
    headers: { 'Access-Control-Allow-Origin': '*' },
    body: JSON.stringify({
      items: comments,
      count: comments.length
    })
  };
}
