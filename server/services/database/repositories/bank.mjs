import mongoose from 'mongoose';
import Bank from '../../../models/Bank.mjs';

export const DATE_FORMATS = [
  'DD/MM/YYYY',
  'DD-MMM-YY',
  'DD.MM.YY',
];

export async function getBanks() {
  return Bank.find({}).exec();
}

export async function getBankById(bankId) {
  return Bank.findOne({ _id: bankId })
    .exec();
}

export async function getBankByName(name) {
  return Bank.findOne({ Name: name })
    .exec();
}

async function bankExists(data) {
  const promises = [];
  const id = data._id || data.id;

  promises.push(getBankByName(data.Name));

  if (id) {
    promises.push(getBankById(id));
  }

  const [byName, byId] = await Promise.all(promises);

  return !!(byName || byId);
}

export function getBankDateFormatOptions() {
  return DATE_FORMATS.map((date) => ({
    value: date,
    name: date,
  }));
}

export async function createBank(data) {
  if (!data._id) {
    data._id = new mongoose.Types.ObjectId();
  }

  const createdBank = await new Bank(data).save();

  if (!createdBank) {
    return null;
  }

  return createdBank;
}

export async function updateBank(data) {
  const id = data._id || data.id;

  if (!await bankExists(data)) {
    throw new Error('Bank doesn\'t exists');
  }

  const bank = await Bank.findOne({ _id: id });

  if (!bank) {
    throw new Error('Bank doesn\'t exists');
  }

  const editedBank = await bank.set(data)
    .save();

  if (!editedBank) {
    throw new Error('Failed to update bank data');
  }

  return editedBank;
}

export async function deleteBankById(bankId) {
  return Bank.deleteOne({
    _id: { $eq: new mongoose.Types.ObjectId(bankId) },
  })
    .exec();
}
