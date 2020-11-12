import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import { RegisterRequest } from '../../requests/auth/RegisterRequest'
import { getUserByEmail, register } from '../../businessLogic/account'
import { createLogger } from '../../utils/logger'
import { generateJWT } from '../../auth/utils'

const logger = createLogger('register');

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const registerRequest: RegisterRequest = JSON.parse(event.body)

  logger.info('Registering a new user ...', registerRequest.email);

  // Check if user email already exists
  const user = await getUserByEmail(registerRequest.email);
  if (user) {
    return {
      statusCode: 442,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({
        error: 'User may already existed'
      })
    }
  }

  // Register a new user 
  const savedUser = await register(registerRequest);

  logger.info('Generating JWT token ...', registerRequest.email);

  // Generate JWT
  delete savedUser.passwordHash;
  const jwt = generateJWT(savedUser);

  logger.info('User registered sucessfully', savedUser);

  return {
    statusCode: 201,
    headers: { 'Access-Control-Allow-Origin': '*' },
    body: JSON.stringify({
      token: jwt, 
      user: savedUser
    })
  };
}