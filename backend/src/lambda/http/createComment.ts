import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import { createComment } from '../../businessLogic/feeds'
import { getUserId } from '../utils'
import { createLogger } from '../../utils/logger'
import { CreateCommentRequest } from '../../requests/CreateCommentRequest'

const logger = createLogger('createComment');

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const newComment: CreateCommentRequest = JSON.parse(event.body);

  logger.info('Creating a new comment ...', newComment);

  // Implement creating a new feed item
  const userId = getUserId(event);
  const newItem = await createComment(userId, newComment);

  logger.info('Comment created sucessfully', newItem);

  return {
    statusCode: 201,
    headers: { 'Access-Control-Allow-Origin': '*' },
    body: JSON.stringify({
      item: newItem
    })
  };
}