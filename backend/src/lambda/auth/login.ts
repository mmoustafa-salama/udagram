import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import { login } from '../../businessLogic/account'
import { createLogger } from '../../utils/logger'
import { LoginRequest } from '../../requests/auth/LoginRequest'
import { generateJWT } from '../../auth/utils'

const logger = createLogger('login');

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const loginRequest: LoginRequest = JSON.parse(event.body);

  logger.info('Logging user in ...', loginRequest.email);

  const user = await login(loginRequest);
  if (!user) {
    return {
      statusCode: 401,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({
        error: 'Unauthorized. Invalid email or password'
      })
    };
  }

  logger.info('Generating JWT token ...', loginRequest.email);

  // Generate JWT
  delete user.passwordHash;
  const jwt = generateJWT(user);

  logger.info('User loggedin sucessfully', user);

  return {
    statusCode: 200,
    headers: { 'Access-Control-Allow-Origin': '*' },
    body: JSON.stringify({
      auth: true, token: jwt, user: user
    })
  }
}

