import { decode, sign } from 'jsonwebtoken'
import { JwtPayload } from './JwtPayload'
import * as bcrypt from 'bcryptjs';
import { config } from '../config/config';
import { User } from '../models/User';

/**
 * Parse a JWT token and return a user id
 * @param jwtToken JWT token to parse
 * @returns a user id from the JWT token
 */
export function parseUserId(jwtToken: string): string {
  const decodedJwt = decode(jwtToken) as JwtPayload
  return decodedJwt.sub
}

export async function generatePassword(plainTextPassword: string): Promise<string> {
  // Use Bcrypt to Generated Salted Hashed Passwords
  const saltRounds = 10;
  const salt = await bcrypt.genSalt(saltRounds);
  const hash = await bcrypt.hash(plainTextPassword, salt)
  return hash;
}

export async function comparePasswords(plainTextPassword: string, hash: string): Promise<boolean> {
  // Use Bcrypt to Compare your password to your Salted Hashed Password
  return await bcrypt.compare(plainTextPassword, hash);
}

export function generateJWT(user: User): string {
  // Use jwt to create a new JWT Payload containing
  const jwtPayload = getJwtPayload(user);
  return sign(JSON.stringify(jwtPayload), config.jwt.secret);
}

function getJwtPayload(user: User) {
  const jwtPayload: JwtPayload = {
    sub: user.userId,
    email: user.email,
    name: user.name,
    iat: Math.floor(Date.now() / 1000) - 30,
    exp: Math.floor(Date.now() / 1000) + (60 * 60) // expires in 1h
  };

  return jwtPayload;
}