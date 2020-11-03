import graphql from 'graphql';
import {
  getVaults,
  getVaultById,
  updateVault,
  createVault,
  deleteVaultById,
} from '../../services/database/repositories/vault.mjs';
import Vault from '../../models/Vault.mjs';
import { getUserById, updateUser } from '../../services/database/repositories/user.mjs';

const { GraphQLError } = graphql;

async function vaultChildren(childArray) {
  if (!childArray || !Array.isArray(childArray) || childArray.length === 0) {
    return [];
  }

  // eslint-disable-next-line no-use-before-define
  return childArray.map((model) => formatVault(model));
}

async function formatVault(vault) {
  const data = vault.toJSON();

  return {
    ...data,
    Parent: data.Parent ? getVaultById.bind(this, data.Parent) : null,
    Children: data.Children.length ? vaultChildren.bind(this, data.id) : [],
  };
}

export async function vaults() {
  const vaultArray = await getVaults();

  return vaultArray.map((vault) => formatVault(vault));
}

export async function upsertVault({ vault: formData }) {
  if (!formData) { // TODO: Validate form data
    throw new GraphQLError('Received invalid vault upsert request data');
  }

  const vault = new Vault(formData);

  if (!vault) {
    throw new GraphQLError('Received data is not valid vault data');
  }

  const newVault = vault.id ? await updateVault(vault) : await createVault(vault);

  return formatVault(newVault);
}

async function handleVaultFunding(user, vault, amount) {
  const { Goal, Balance } = vault;
  const { Savings } = user.Vaults.UnassignedBalances;
  const appliedAmount = amount > (Goal - Balance) ? Goal - Balance : amount;

  if (amount > Savings) {
    throw new GraphQLError('Insufficient unassigned funds');
  }

  vault.set({ Balance: Balance + appliedAmount });
  user.set({ Vaults: { UnassignedBalances: { Savings: Savings - appliedAmount } } });

  await updateUser(user);

  return updateVault(vault);
}

async function handleVaultWithdrawal(user, vault, amount) {
  const { Balance } = vault;
  const { Savings } = user.Vaults.UnassignedBalances;

  if (amount > Balance) {
    throw new GraphQLError('Insufficient vault balance');
  }

  vault.set({ Balance: Balance - amount });
  user.set({ Vaults: { UnassignedBalances: { Savings: Savings + amount } } });

  await updateUser(user);

  return updateVault(vault);
}

export async function createVaultTransfer({ id, amount, direction }) {
  if (!id || amount <= 0 || !direction) { // TODO: Validate form data
    throw new GraphQLError('Received invalid vault transfer request data');
  }
  // TODO: Replace later with proper user auth!!!!
  const [user, vault] = await Promise.all([getUserById(process.env.DEV_USER_ID), getVaultById(id)]);
  const fixedAmount = Number.parseFloat(amount.toFixed(2, 10));

  switch (direction) {
    case 'INCOMING':
      return formatVault(await handleVaultFunding(user, vault, fixedAmount));
    case 'OUTGOING':
      return formatVault(await handleVaultWithdrawal(user, vault, fixedAmount));
    default:
      throw new GraphQLError('Invalid transfer direction');
  }
}

export async function deleteVault({ vaultId }) {
  if (typeof vaultId !== 'string') {
    throw new GraphQLError('Received invalid account deletion request data');
  }

  const { deletedCount } = await deleteVaultById(vaultId);

  return !!deletedCount;
}
