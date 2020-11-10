import mongoose from 'mongoose';
import Account from '../../../models/Account.mjs';
import Transaction from '../../../models/Transaction.mjs';

export async function getAccounts() {
  return Account.find({})
    .exec();
}

export async function getAccountById(accountId) {
  return Account.findOne({ _id: accountId })
    .exec();
}

export async function getAccountByNumber(number) {
  return Account.findOne({ Number: number })
    .exec();
}

export async function getAccountByName(name) {
  return Account.findOne({ Name: name })
    .exec();
}

async function accountExists(data) {
  const promises = [];
  const id = data._id || data.id;

  promises.push(getAccountByName(data.Name));

  if (data.Number) {
    promises.push(getAccountByNumber(data.Number));
  }

  if (id) {
    promises.push(getAccountById(id));
  }

  const [byName, byNumber, byId] = await Promise.all(promises);

  return !!(byName || byNumber || byId);
}

export async function createAccount(data) {
  // TODO: Add data validation
  if (await accountExists(data)) {
    throw new Error('Account already exists');
  }

  data._id = new mongoose.Types.ObjectId();

  const createdAccount = await new Account(data).save();

  if (!createdAccount) {
    return null;
  }

  return createdAccount;
}

export async function updateAccount(data) {
  // TODO: Add data validation
  const id = data._id || data.id;

  if (!await accountExists(data)) {
    throw new Error('Account doesn\'t exists');
  }

  const account = await Account.findOne({ _id: id });

  if (!account) {
    throw new Error('Account doesn\'t exists');
  }

  const editedAccount = await account.set(data)
    .save();

  if (!editedAccount) {
    throw new Error('Failed to update account data');
  }

  return editedAccount;
}

export async function deleteAccountById(accountId) {
  return Account.deleteOne({
    _id: { $eq: new mongoose.Types.ObjectId(accountId) },
  })
    .exec();
}

async function fetchBalance(match) {
  const balance = await Transaction.aggregate([
    match,
    {
      $set: {
        Amount: {
          $cond: {
            if: { $eq: ['$Direction', 'OUT'] },
            then: { $multiply: ['$Amount', -1] },
            else: '$Amount',
          },
        },
      },
    },
    {
      $group: {
        _id: '$Account',
        Total: { $sum: '$Amount' },
      },
    },
    {
      $project: {
        _id: 0,
        Total: { $round: ['$Total', 2] },
      },
    },
  ])
    .exec();

  return balance[0] ? balance[0].Total : 0;
}

export async function getTotalBalance(accountId) {
  return fetchBalance({
    $match: {
      Account: new mongoose.Types.ObjectId(accountId),
      Category: { $exists: true },
      Type: { $nin: ['SAVINGS', 'INVESTMENT'] },
    },
  });
}

export async function getAvailableBalance(accountId) {
  return fetchBalance({
    $match: {
      Account: new mongoose.Types.ObjectId(accountId),
      $or: [
        { Category: { $exists: true } },
        { Type: { $in: ['SAVINGS', 'INVESTMENT'] } },
      ],
    },
  });
}

export async function getSavingsBalance(accountId) {
  const balance = await fetchBalance({
    $match: {
      Account: new mongoose.Types.ObjectId(accountId),
      Type: { $eq: 'SAVINGS' },
    },
  });

  return balance * -1;
}
