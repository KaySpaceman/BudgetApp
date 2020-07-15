import Account from '../../../models/Account.mjs';
import mongoose from 'mongoose';

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

async function accountExists(data) {
  const promises = [];

  promises.push(getAccountByName(data.Name));

  if (data.Number) {
    promises.push(getAccountByNumber(data.Number));
  }

  const [byName, byNumber] = await Promise.all(promises);

  return !!(byName || byNumber);
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
