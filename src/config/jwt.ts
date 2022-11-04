import jwt from 'jsonwebtoken';
import { isNil } from 'lodash-es';

import { getCryptr } from './cryptr.js';

let secret: string;

interface Payload extends jwt.JwtPayload {
  data: string,
}

function getSecret() {
  if (!isNil(secret)) {
    return secret;
  }
  if (isNil(process.env.JWT_SECRET) || process.env.JWT_SECRET.length < 16) {
    throw new Error('(jwt.ts) Error: Environment variable JWT_SECRET must be set and be a random string of length >= 16.');
  }
  secret = process.env.JWT_SECRET;
  return secret;
}

function sign(data: object, expiresIn?: string | number) {
  return jwt.sign(<Payload>{
    data: getCryptr().encrypt(JSON.stringify(data)),
  }, getSecret(), {
    expiresIn: expiresIn,
  });
}

function verify(token: string) {
  const payload = <Payload>jwt.verify(token, getSecret());
  const data = JSON.parse(getCryptr().decrypt(payload.data));
  return data;
}

export { sign, verify };
