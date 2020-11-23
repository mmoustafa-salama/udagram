import 'source-map-support/register';
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda';
import { UpdateCommentRequest } from '../../requests/UpdateCommentRequest';
import { updateComment } from '../../businessLogic/feeds';
import { createLogger } from '../../utils/logger';

const logger = createLogger('updateComment');

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

  const updateCommentRequest: UpdateCommentRequest = JSON.parse(event.body);

  logger.info(`Updating a comment with the Id '${commentId}' ...`);

  // Update a comment with the provided id using values in the "updateCommentRequest" object
  const updatedComment = await updateComment(commentId, updateCommentRequest);
  if (!updatedComment) {

    logger.error(`No comment with the Id '${commentId}' exist`);

    return {
      statusCode: 404,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({
        error: `No comment with the Id '${commentId}' exist`
      })
    };
  }

  logger.info('Comment updated sucessfully', updatedComment);

  return {
    statusCode: 200,
    headers: { 'Access-Control-Allow-Origin': '*' },
    body: JSON.stringify({
      item: updatedComment,
    })
  }
}