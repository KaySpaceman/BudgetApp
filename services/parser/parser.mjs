import citadele from './citadele.mjs';
import revolut from './revolut.mjs';

export default function parseTransactionData(path, bank) {
  switch (bank) {
    case 'citadele':
      return citadele(path);
    case 'revolut':
      return revolut(path);
    default:
      throw new Error(`Selected bank "${bank}" is unsupported`);
  }
}
