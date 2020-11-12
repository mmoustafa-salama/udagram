import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import { CreateFeedItemRequest } from '../../requests/CreateFeedItemRequest'
import { createFeedItem } from '../../businessLogic/feeds'
import { getUserId } from '../utils'
import { createLogger } from '../../utils/logger'

const logger = createLogger('createFeedItem');

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const newFeedItem: CreateFeedItemRequest = JSON.parse(event.body);

  logger.info('Creating a new feed item ...', newFeedItem);

  // Implement creating a new feed item
  const userId = getUserId(event);
  const newItem = await createFeedItem(userId, newFeedItem);

  logger.info('Feed item created sucessfully', newItem);

  return {
    statusCode: 201,
    headers: { 'Access-Control-Allow-Origin': '*' },
    body: JSON.stringify({
      item: newItem
    })
  };
}