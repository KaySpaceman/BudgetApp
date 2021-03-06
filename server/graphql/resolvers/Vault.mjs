import graphql from 'graphql';
import {
  getVaultsByFilter,
  getVaultById,
  updateVault,
  createVault,
  deleteVaultById, refreshValues, getVaultsByIds,
} from '../../services/database/repositories/vault.mjs';
import { getUserById, updateUser } from '../../services/database/repositories/user.mjs';

const { GraphQLError } = graphql;

async function vaultChildren(childArray) {
  if (!childArray || !Array.isArray(childArray) || childArray.length === 0) {
    return [];
  }

  // eslint-disable-next-line no-use-before-define
  return childArray.map(async (id) => formatVault(await getVaultById(id)));
}

function formatVault(vault) {
  const data = vault.toJSON();

  return {
    ...data,
    Parent: data.Parent ? getVaultById.bind(this, data.Parent) : null,
    Children: data.Children.length ? vaultChildren.bind(this, data.Children) : [],
  };
}

export async function vaults({ onlyTopLevel }) {
  const filters = [];

  if (onlyTopLevel) {
    filters.push({ Parent: null });
  }

  const vaultArray = await getVaultsByFilter(filters);

  return vaultArray.map((vault) => formatVault(vault));
}

export async function upsertVault({ vault }) {
  if (!vault) { // TODO: Validate form data
    throw new GraphQLError('Received invalid vault upsert request data');
  }

  if (vault.Children && vault.Children.length > 0) {
    if (vault.Parent) throw new Error('A child vault can\'t have its own children');

    const parent = vault.id ? await getVaultById(vault.id)
      : await createVault({ ...vault, Children: [] });

    const childUpdates = vault.Children.map((child) => {
      const childVault = {
        ...child,
        Parent: parent._id,
      };

      return childVault.id ? updateVault(childVault) : createVault(childVault);
    });

    const childVaults = await Promise.all(childUpdates);
    parent.set({ Children: childVaults.map((child) => child._id) });

    return formatVault(await refreshValues(parent));
  }

  const newVault = vault.id ? await updateVault(vault) : await createVault(vault);

  return formatVault(newVault);
}

async function fundVault(vault, amount) {
  const { Goal, Balance } = vault;
  const appliedAmount = amount > (Goal - Balance) ? Goal - Balance : amount;

  if (vault.Children && vault.Children.length > 0) {
    let remainder = appliedAmount;

    const childVaults = await getVaultsByIds(vault.Children);

    const childUpdates = childVaults.map((child) => {
      const { Goal: childGoal, Balance: childBalance } = child;
      const change = remainder > (childGoal - childBalance) ? childGoal - childBalance : remainder;

      if (remainder <= 0 || (childBalance >= childGoal)) return child;

      remainder -= change;

      return fundVault(child, change);
    });

    await Promise.all(childUpdates);
  } else {
    vault.set({ Balance: Balance + appliedAmount });
  }

  return updateVault(vault);
}

async function withdrawFromVault(vault, amount) {
  const { Balance } = vault;

  if (vault.Children && vault.Children.length > 0) {
    let remainder = amount;

    const childVaults = await getVaultsByIds(vault.Children);

    const childUpdates = childVaults.map((child) => {
      const { Balance: childBalance } = child;
      const change = remainder > childBalance ? childBalance : remainder;

      if (remainder <= 0 || (childBalance === 0)) return child;

      remainder -= change;

      return withdrawFromVault(child, change);
    });

    await Promise.all(childUpdates);
  } else {
    vault.set({ Balance: Balance - amount });
  }

  return updateVault(vault);
}

async function handleVaultFunding(user, vault, amount) {
  const { Goal, Balance } = vault;
  const { UnassignedSavings } = user;
  const appliedAmount = amount > (Goal - Balance) ? Goal - Balance : amount;

  if (appliedAmount > UnassignedSavings) throw new GraphQLError('Insufficient unassigned funds');

  const fundedVault = await fundVault(vault, appliedAmount);

  user.set({ UnassignedSavings: UnassignedSavings - appliedAmount });
  const [refreshedVault] = await Promise.all([refreshValues(fundedVault), updateUser(user)]);

  return refreshedVault;
}

async function handleVaultWithdrawal(user, vault, amount) {
  const { Balance } = vault;
  const { UnassignedSavings } = user;

  if (amount > Balance) throw new GraphQLError('Insufficient vault balance');

  const updatedVault = await withdrawFromVault(vault, amount);

  user.set({ UnassignedSavings: UnassignedSavings + amount });
  const [refreshedVault] = await Promise.all([refreshValues(updatedVault), updateUser(user)]);

  return refreshedVault;
}

export async function createVaultTransfer({ id, amount, direction }) {
  if (!id || amount <= 0 || !direction) { // TODO: Validate form data
    throw new GraphQLError('Received invalid vault transfer request data');
  }
  // TODO: Replace later with proper user auth!!!!
  const [user, vault] = await Promise.all([getUserById(process.env.DEV_USER_ID), getVaultById(id)]);
  const fixedAmount = Number.parseFloat(amount.toFixed(2));

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
  // TODO: Replace later with proper user auth!!!!
  const [user, vault] = await Promise.all(
    [getUserById(process.env.DEV_USER_ID), getVaultById(vaultId)],
  );

  if (!vault) throw new GraphQLError('Vault doesn\'t exist');

  const { Balance } = vault;
  const { deletedCount } = await deleteVaultById(vaultId);

  if (!deletedCount) throw new GraphQLError('Vault deletion failed');

  user.set({ UnassignedSavings: user.UnassignedSavings + Balance });
  await updateUser(user);

  return !!deletedCount;
}
