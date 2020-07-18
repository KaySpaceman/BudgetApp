import Account from '../../../models/Account.mjs';
import mongoose from 'mongoose';

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

export async function editAccount(data) {
  if (!await accountExists(data)) {
    throw new Error('Account doesn\'t exists');
  }

  const account = await Account.findOne({ _id: data._id });

  if (!account) {
    return null;
  }

  const editedAccount = await account.set(data)
    .save();

  if (!editedAccount) {
    return null;
  }

  return editedAccount;
}

async function accountExists(data) {
  const promises = [];

  promises.push(getAccountByName(data.Name));

  if (data.Number) {
    promises.push(getAccountByNumber(data.Number));
  }

  if (data._id) {
    promises.push(getAccountById(data._id));
  }

  const [byName, byNumber, byId] = await Promise.all(promises);

  return !!(byName || byNumber || byId);
}

export function getAccounts() {
  return Account.find({})
    .exec();
}

export async function getAccountSelectOptions() {
  const accounts = await Account.aggregate([
    { $sort: { Name: 1 } },
    {
      $project: {
        value: '$_id',
        name: '$Name',
      },
    },
  ])
    .exec();

  return accounts.map((x) => {
    if (x.value) {
      x.value = x.value.toString();
    }

    return x;
  });
}
