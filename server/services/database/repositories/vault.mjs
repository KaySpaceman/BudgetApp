import mongoose from 'mongoose';
import Vault from '../../../models/Vault.mjs';

export async function getVaults() {
  return Vault.find({})
    .exec();
}

export async function getVaultById(vaultId) {
  let id = vaultId;

  if (!(vaultId instanceof mongoose.Types.ObjectId)) {
    try {
      id = new mongoose.Types.ObjectId(vaultId);
    } catch (e) {
      throw new Error('Invalid vault id value');
    }
  }

  return Vault.findOne({ _id: id })
    .exec();
}

export async function createVault(vault) {
  let vaultModel = vault;

  if (!(vault instanceof Vault)) {
    vaultModel = new Vault(vault);

    if (!vaultModel) {
      throw new Error('Invalid vault data');
    }
  }

  const newVaultModel = await vaultModel.set({ _id: new mongoose.Types.ObjectId() })
    .save();

  if (!newVaultModel) throw new Error('Failed to create new vault');

  return newVaultModel;
}

export async function updateVault(vault) {
  const vaultModel = await getVaultById(vault.id);

  if (!vaultModel) {
    throw new Error('Vault doesn\'t exists');
  }

  const updatedVault = await vaultModel.set(vault)
    .save();

  if (!updatedVault) throw new Error('Failed to update vault data');

  return updatedVault;
}

export async function deleteVaultById(vaultId) {
  let id = vaultId;

  if (!(vaultId instanceof mongoose.Types.ObjectId)) {
    id = new mongoose.Types.ObjectId(vaultId);

    if (!id) {
      throw new Error('Invalid vault id value');
    }
  }

  return Vault.deleteOne({ _id: id })
    .exec();
}
