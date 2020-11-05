import mongoose from 'mongoose';
import Vault from '../../../models/Vault.mjs';

export async function getVaultById(vaultId) {
  const id = vaultId instanceof mongoose.Types.ObjectId
    ? vaultId : new mongoose.Types.ObjectId(vaultId);

  if (!id) throw new Error('Invalid vault id value');

  return Vault.findOne({ _id: id })
    .exec();
}

export async function getVaultsByIds(vaultIds) {
  const ids = vaultIds.map((stringId) => {
    const id = stringId instanceof mongoose.Types.ObjectId ? stringId
      : new mongoose.Types.ObjectId(stringId);

    if (!id) throw new Error('Invalid vault id value');

    return id;
  });

  return Vault.find({ _id: { $in: ids } })
    .exec();
}

export async function getVaultsByFilter(filters = []) {
  const filterObject = filters.reduce((acc, cur) => ({ ...acc, ...cur }), {});

  return Vault.find(filterObject)
    .exec();
}

export async function createVault(data) {
  const vault = data instanceof Vault ? data : new Vault(data);

  if (!vault) throw new Error('Invalid vault data');

  if (data.Children && data.Children.length > 0) {
    if (vault.Parent) throw new Error('A child vault can\'t have its own children');
  }

  const newVault = await vault.set({ _id: new mongoose.Types.ObjectId() })
    .save();

  if (!newVault) throw new Error('Failed to create new vault');

  return newVault;
}

export async function updateVault(data) {
  let vault = data;

  if (!(vault instanceof Vault)) {
    vault = await getVaultById(data.id);
    vault.set(data);
  }

  if (!vault) throw new Error('Vault doesn\'t exists');

  if (vault.Parent && data.Children && data.Children.length > 0) {
    throw new Error('A child vault can\'t have its own children');
  }

  const updatedVault = await vault.save();

  if (!updatedVault) throw new Error('Failed to update vault data');

  return updatedVault;
}

export async function refreshValues(subject) {
  const vault = subject instanceof Vault ? subject : await getVaultById(subject);

  if (!vault.Children || vault.Children.length <= 0) return vault;

  let newGoal = 0;
  let newBalance = 0;
  const childVaults = await getVaultsByIds(vault.Children);

  childVaults.forEach((child) => {
    newGoal += child.Goal;
    newBalance += child.Balance;
  });

  vault.set({ Balance: newBalance, Goal: newGoal });

  return updateVault(vault);
}

export async function deleteVaultById(vaultId) {
  const id = vaultId instanceof mongoose.Types.ObjectId
    ? vaultId : new mongoose.Types.ObjectId(vaultId);

  if (!id) throw new Error('Invalid vault id value');

  const vault = await getVaultById(vaultId);

  if (!vault) throw new Error('Vault doesn\'t exist');

  return Vault.deleteMany({ _id: { $in: [vaultId, ...vault.Children] } })
    .exec();
}
