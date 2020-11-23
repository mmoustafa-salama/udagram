import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { deleteFeedItemById } from '../../businessLogic/feeds';
import { createLogger } from '../../utils/logger';

const logger = createLogger('deleteFeedItem');

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

  logger.info(`Removing a feed item with the Id '${feedItemId}' ...`);

  // Remove a Feed item by id
  if (await deleteFeedItemById(feedItemId) !== true) {

    logger.error(`No feed item with the Id '${feedItemId}' exist`);

    return {
      statusCode: 404,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({
        error: `No feed item with the Id '${feedItemId}' exist`
      })
    };
  }

  logger.info(`Feed item with the Id '${feedItemId}' removed sucessfully`);

  return {
    statusCode: 200,
    headers: { 'Access-Control-Allow-Origin': '*' },
    body: ''
  };
}