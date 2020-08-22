import mongoose from 'mongoose';
import Account from '../../../models/Account.mjs';
import Transaction from '../../../models/Transaction.mjs';

export function getAccounts() {
  return Account.find({})
    .exec();
}

export async function getAccountById(id) {
  return Account.findOne({ _id: id })
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

export async function calculateAccountBalance(accountId) {
  const balance = await Transaction.aggregate([
    {
      $match: { Account: new mongoose.Types.ObjectId(accountId) },
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
