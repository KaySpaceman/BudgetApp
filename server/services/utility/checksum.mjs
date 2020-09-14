import crypto from 'crypto';

export default function generateHash({ Date, Note, Amount }) {
  return crypto.createHash('sha256')
    .update(JSON.stringify({ Date, Note, Amount }), 'utf8')
    .digest('hex');
}
