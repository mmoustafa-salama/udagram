import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import { createLike } from '../../businessLogic/feeds'
import { getUserId } from '../utils'
import { createLogger } from '../../utils/logger'
import { LikeRequest } from '../../requests/LikeRequest'

const logger = createLogger('createLike');

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const newLike: LikeRequest = JSON.parse(event.body);

  logger.info('Creating a new like ...', newLike);

  // Implement creating a like
  const userId = getUserId(event);
  const newItem = await createLike(userId, newLike);

  logger.info('Like created sucessfully', newItem);

  return {
    statusCode: 201,
    headers: { 'Access-Control-Allow-Origin': '*' },
    body: JSON.stringify({
      item: newItem
    })
  };
}