import * as Accounts from './Account.mjs';
import * as Banks from './Bank.mjs';
import * as Category from './Category.mjs';
import * as Transaction from './Transaction.mjs';
import * as Vault from './Vault.mjs';
import * as User from './User.mjs';
import * as Chart from './Chart.mjs';

export default {
  ...Accounts,
  ...Banks,
  ...Category,
  ...Transaction,
  ...Vault,
  ...User,
  ...Chart,
};
