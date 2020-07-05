import Bank from '../../../models/Bank.mjs';
import mongoose from 'mongoose';

export async function createBank(data) {
  if (!data._id)
    data._id = new mongoose.Types.ObjectId();

  const createdBank = await new Bank(data).save();

  if (!createdBank)
    return false;

  return createdBank;
}

export async function getBankSelectOptions() {
  const banks = await Bank.aggregate([
    { $sort: { Name: 1 } },
    {
      $project: {
        value: '$_id',
        name: '$Name',
      },
    },
  ])
    .exec();

  return banks.map((x) => {
    if (x.value)
      x.value = x.value.toString();

    return x;
  });
}
