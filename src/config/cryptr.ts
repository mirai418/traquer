import Cryptr from 'cryptr';
import { isNil } from 'lodash-es';

let cryptr: Cryptr;

function createCryptr() {
  if (isNil(process.env.CRYPTR_SECRET) || process.env.CRYPTR_SECRET.length < 16) {
    throw new Error('Environment variable CRYPTR_SECRET must be set and be a random string of length >= 16.');
  }
  cryptr = new Cryptr(process.env.CRYPTR_SECRET || '');
  return cryptr;
}

function getCryptr() {
  return cryptr || createCryptr();
}

export { createCryptr, getCryptr };
