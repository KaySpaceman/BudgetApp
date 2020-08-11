import crypto from 'crypto';

export default function generateHash(source) {
  return crypto.createHash('sha256')
    .update(JSON.stringify(source), 'utf8')
    .digest('hex');
}
