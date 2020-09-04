import * as Accounts from './Accounts.mjs';
import * as Banks from './Banks.mjs';
import * as Category from './Category.mjs';

export default {
  ...Accounts,
  ...Banks,
  ...Category,
};
