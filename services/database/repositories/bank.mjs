import Bank from '../../../models/Bank.mjs';
import mongoose from 'mongoose';
import { DATE_FORMATS } from '../../parser/parser.mjs';

export async function getBankById(id) {
  return Bank.findOne({ _id: id })
    .exec();
}

export async function createBank(data) {
  if (!data._id) {
    data._id = new mongoose.Types.ObjectId();
  }

  const createdBank = await new Bank(data).save();

  if (!createdBank) {
    return false;
  }

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
    if (x.value) {
      x.value = x.value.toString();
    }

    return x;
  });
}

export function getBankDateFormatOptions() {
  return DATE_FORMATS.map((date) => {
    return {
      value: date,
      name: date,
    }
  });
}
