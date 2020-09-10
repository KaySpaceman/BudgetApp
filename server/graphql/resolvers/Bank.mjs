import graphql from 'graphql';
import {
  getBanks,
  getBankDateFormatOptions,
  updateBank,
  createBank,
  deleteBankById,
} from '../../services/database/repositories/bank.mjs';

const { GraphQLError } = graphql;

export async function banks() {
  const rawBanks = await getBanks();

  return rawBanks.map((model) => model.toJSON());
}

export async function bankDateFormats() {
  return getBankDateFormatOptions();
}

export async function upsertBank({ bank }) {
  if (!bank) {
    throw new GraphQLError('Received invalid bank upsert request data');
  }

  return bank.id ? updateBank(bank) : createBank(bank);
}

export async function deleteBank({ bankId }) {
  if (typeof bankId !== 'string') {
    throw new GraphQLError('Received invalid bank deletion request data');
  }

  const { deletedCount } = await deleteBankById(bankId);

  return !!deletedCount;
}
