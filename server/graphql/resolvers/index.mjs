import * as Accounts from './Account.mjs';
import * as Banks from './Bank.mjs';
import * as Category from './Category.mjs';
import * as Transaction from './Transaction.mjs';

export default {
  ...Accounts,
  ...Banks,
  ...Category,
  ...Transaction,
};
