import mongoose from 'mongoose';
import Vault from '../../../models/Vault.mjs';

export async function getVaults(filters = []) {
  const filterObject = filters.reduce((acc, cur) => ({ ...acc, ...cur }), {});

  return Vault.find(filterObject)
    .exec();
}

export async function getVaultById(vaultId) {
  const id = vaultId instanceof mongoose.Types.ObjectId
    ? vaultId : new mongoose.Types.ObjectId(vaultId);

  if (!id) throw new Error('Invalid vault id value');

  return Vault.findOne({ _id: id })
    .exec();
}

export async function createVault(vault) {
  const vaultModel = vault instanceof Vault ? vault : new Vault(vault);

  if (!vaultModel) throw new Error('Invalid vault data');

  const newVaultModel = await vaultModel.set({ _id: new mongoose.Types.ObjectId() })
    .save();

  if (!newVaultModel) throw new Error('Failed to create new vault');

  return newVaultModel;
}

export async function updateVault(vault) {
  let vaultModel = vault;

  if (!(vaultModel instanceof Vault)) {
    vaultModel = await getVaultById(vault.id);
    vaultModel.set(vault);
  }

  if (!vaultModel) throw new Error('Vault doesn\'t exists');

  const updatedVault = await vaultModel.save();

  if (!updatedVault) throw new Error('Failed to update vault data');

  return updatedVault;
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
