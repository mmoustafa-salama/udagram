import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { getImageUploadUrl } from '../../businessLogic/feeds'
import { createLogger } from '../../utils/logger';

const logger = createLogger('generateUploadUrl');

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const fileName = event.pathParameters.fileName;
  if (!fileName) {
    return {
      statusCode: 400,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({
        error: 'fileName is reeuired.'
      })
    };
  }

  logger.info(`Generating upload url for an image with the name '${fileName}' ...`);

  // Return a presigned URL to upload a file for an image with the provided name
  const url = getImageUploadUrl(fileName);

  return {
    statusCode: 202,
    headers: { 'Access-Control-Allow-Origin': '*' },
    body: JSON.stringify({
      uploadUrl: url
    })
  };
}