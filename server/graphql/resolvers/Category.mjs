/* eslint-disable no-use-before-define */
import graphql from 'graphql';
import {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategoryById,
} from '../../services/database/repositories/category.mjs';

const { GraphQLError } = graphql;

async function categoryById(categoryId) {
  const model = await getCategoryById(categoryId);
  const data = model.toJSON();

  return {
    ...data,
    Parent: data.Parent ? categoryById.bind(this, data.Parent) : null,
    Children: data.Children ? categoryChildren.bind(this, data.Children) : [],
  };
}

async function categoryChildren(childArray) {
  if (!childArray || !Array.isArray(childArray) || childArray.length === 0) {
    return [];
  }

  return childArray.map((data) => ({
    ...data,
    id: data._id.toString(),
    Parent: data.Parent ? categoryById.bind(this, data.Parent) : null,
    Children: data.Children ? categoryChildren.bind(this, data.Children) : [],
  }));
}

export async function categories({ maxLevel, type }) {
  const filters = [];

  if (maxLevel) {
    filters.push({ Level: { $lte: maxLevel } });
  }

  if (type) {
    filters.push({ Type: type });
  }

  const rawCategories = await getCategories(filters);

  return rawCategories.map((model) => {
    const data = model.toJSON();

    return {
      ...data,
      Parent: data.Parent ? categoryById.bind(this, data.Parent) : null,
      Children: data.Children ? categoryChildren.bind(this, data.Children) : [],
    };
  });
}

export async function upsertCategory({ category }) {
  // TODO: Add data validation
  if (!category) {
    throw new GraphQLError('Received invalid category upsert request data');
  }

  const model = category.id ? await updateCategory(category) : await createCategory(category);
  const data = model.toJSON();

  return {
    ...data,
    Parent: data.Parent ? categoryById.bind(this, data.Parent) : null,
    Children: data.Children ? categoryChildren.bind(this, data.Children) : [],
  };
}

export async function deleteCategory({ categoryId }) {
  if (typeof categoryId !== 'string') {
    throw new GraphQLError('Received invalid category deletion request data');
  }

  const deleteResponse = await deleteCategoryById(categoryId);

  return Array.isArray(deleteResponse) && deleteResponse.length > 0;
}
