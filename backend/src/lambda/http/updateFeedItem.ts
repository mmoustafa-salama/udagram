import 'source-map-support/register';
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda';
import { UpdateFeedItemRequest } from '../../requests/UpdateFeedItemtRequest';
import { updateFeedItem } from '../../businessLogic/feeds';
import { createLogger } from '../../utils/logger';

const logger = createLogger('updateFeedItem');

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

  const updateFeedItemRequest: UpdateFeedItemRequest = JSON.parse(event.body);

  logger.info(`Updating a Feed item with the Id '${feedItemId}' ...`);

  // Update a feed item with the provided id using values in the "updateFeedItemRequest" object
  const feedItemItem = await updateFeedItem(feedItemId, updateFeedItemRequest);
  if (!feedItemItem) {

    logger.error(`No feed item with the Id '${feedItemId}' exist`);

    return {
      statusCode: 404,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({
        error: `No feed item with the Id '${feedItemId}' exist`
      })
    };
  }

  logger.info('Feed item updated sucessfully', feedItemItem);

  return {
    statusCode: 200,
    headers: { 'Access-Control-Allow-Origin': '*' },
    body: JSON.stringify({
      item: feedItemItem,
    })
  }
}