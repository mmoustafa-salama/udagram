import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { deleteCommentById } from '../../businessLogic/feeds';
import { createLogger } from '../../utils/logger';

const logger = createLogger('deleteComment');

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const commentId = event.pathParameters.id;
  if (!commentId) {
    return {
      statusCode: 400,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({
        error: `Comment ID is reeuired.`
      })
    };
  }

  logger.info(`Removing a comment with the Id '${commentId}' ...`);

  // Remove a comment by id
  if (await deleteCommentById(commentId) !== true) {

    logger.error(`No comment with the Id '${commentId}' exist`);

    return {
      statusCode: 404,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({
        error: `No comment with the Id '${commentId}' exist`
      })
    };
  }

  logger.info(`Comment with the Id '${commentId}' removed sucessfully`);

  return {
    statusCode: 200,
    headers: { 'Access-Control-Allow-Origin': '*' },
    body: ''
  };
}