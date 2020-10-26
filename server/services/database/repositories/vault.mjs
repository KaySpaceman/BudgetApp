import Vault from '../../../models/Vault.mjs';

export async function getVaults() {
  return Vault.find({})
    .exec();
}

export async function getVaultById(vaultId) {
  return Vault.findOne({ _id: vaultId })
    .exec();
}
