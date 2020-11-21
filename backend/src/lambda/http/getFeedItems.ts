import 'source-map-support/register';
import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda';
import { getUserId } from '../utils';
import { getAllFeedItems } from '../../businessLogic/feeds';
import { createLogger } from '../../utils/logger';

const logger = createLogger('getTodo');

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

  logger.info('Getting all Feed items for a current user ...');

  // Get all Feed items for a current user
  const userId = getUserId(event);
  const feedItems = await getAllFeedItems(userId);

  return {
    statusCode: 200,
    headers: { 'Access-Control-Allow-Origin': '*' },
    body: JSON.stringify({
      items: feedItems,
      count: feedItems.length
    })
  };
}
