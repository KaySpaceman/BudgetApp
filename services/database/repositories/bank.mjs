import Bank from '../../../models/Bank.mjs';
import mongoose from 'mongoose';

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
