import graphql from 'graphql';
import {
  getVaults,
  getVaultById,
  updateVault,
  createVault,
  deleteVaultById,
} from '../../services/database/repositories/vault.mjs';
import Vault from '../../models/Vault.mjs';

const { GraphQLError } = graphql;

async function vaultChildren(childArray) {
  if (!childArray || !Array.isArray(childArray) || childArray.length === 0) {
    return [];
  }

  return childArray.map((model) => {
    const data = model.toJSON();

    return {
      ...data,
      Parent: data.Parent ? getVaultById.bind(this, data.Parent) : null,
      Children: data.Children.length ? vaultChildren.bind(this, data.Children) : [],
    };
  });
}

export async function vaults() {
  const vaultArray = await getVaults();

  return vaultArray.map((vault) => {
    const data = vault.toJSON();

    return {
      ...data,
      Parent: data.Parent ? getVaultById.bind(this, data.Parent) : null,
      Children: data.Children.length ? vaultChildren.bind(this, data.id) : [],
    };
  });
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
  const data = newVault.toJSON();

  return {
    ...data,
    Parent: data.Parent ? getVaultById.bind(this, data.Parent) : null,
    Children: data.Children.length ? vaultChildren.bind(this, data.id) : [],
  };
}

export async function deleteVault({ vaultId }) {
  if (typeof vaultId !== 'string') {
    throw new GraphQLError('Received invalid account deletion request data');
  }

  const { deletedCount } = await deleteVaultById(vaultId);

  return !!deletedCount;
}
