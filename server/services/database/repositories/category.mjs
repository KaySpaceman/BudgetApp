import mongoose from 'mongoose';
import Category from '../../../models/Category.mjs';
import Transaction from '../../../models/Transaction.mjs';

export async function getCategories() {
  return Category.find({})
    .exec();
}

export async function getCategoryById(categoryId) {
  return Category.findOne({ _id: categoryId })
    .exec();
}

export async function regenerateTree() {
  return Category.regenerateTree();
}

export async function getCategoriesUpToLevel(maxLevel = 1) {
  const categories = Category.find({ Level: { $lte: maxLevel } })
    .exec();

  if (categories.length === 0) {
    await regenerateTree();

    return Category.find({ Level: { $lte: maxLevel } })
      .exec();
  }

  return categories;
}

export async function getSystemCategoryIds() {
  const systemCategories = await Category.aggregate([
    {
      $match: { IsSystem: { $eq: true } },
    },
    {
      $project: { _id: 1 },
    },
  ]);

  return systemCategories.map((category) => category._id.toString());
}

export async function createCategory(data) {
  // TODO: Add data validation
  // TODO: Prevent same name on one level
  const newCategory = new Category({
    ...data,
    _id: new mongoose.Types.ObjectId(),
  });

  const savedCategory = await newCategory.save();

  if (!savedCategory) {
    return null;
  }

  await regenerateTree();

  return Category.findOne({ _id: savedCategory.id })
    .exec();
}

export async function updateCategory(data) {
  // TODO: Add data validation
  // TODO: Prevent same name on one level
  const id = data._id || data.id;
  const category = await Category.findOne({ _id: id });

  if (!category) {
    throw new Error('Category doesn\'t exists');
  }

  const editedCategory = await category.set(data)
    .save();

  if (!editedCategory) {
    throw new Error('Failed to update category data');
  }

  await regenerateTree();

  return Category.findOne({ _id: editedCategory.id });
}

export async function deleteCategoryById(categoryId) {
  let deletedCategoryIds = [];
  const cleanupPromises = [];
  const category = await Category.findById(categoryId)
    .exec();

  if (!category) {
    return [];
  }

  deletedCategoryIds = Category.findDescendantIds(category.Children);
  deletedCategoryIds.push(category._id);

  const systemCategoryIds = await getSystemCategoryIds();

  deletedCategoryIds = deletedCategoryIds.filter(
    (id) => !systemCategoryIds.includes(id.toString()),
  );

  cleanupPromises.push(
    Category.deleteMany({ _id: { $in: deletedCategoryIds } })
      .exec()
      .then(({ deletedCount }) => {
        regenerateTree();
        return deletedCount;
      }),
  );

  cleanupPromises.push(
    Transaction.where({ Category: { $in: deletedCategoryIds } })
      .update({ $unset: { Category: '' } })
      .exec(),
  );

  return Promise.all(cleanupPromises);
}
