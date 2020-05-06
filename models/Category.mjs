/* eslint-disable no-underscore-dangle, no-param-reassign, func-names, array-callback-return */
import mongoose from 'mongoose';
import _ from 'lodash';

const categorySchema = new mongoose.Schema({
  _id: mongoose.ObjectId,
  Name: String,
  Parent: mongoose.ObjectId,
  Children: Array,
});

categorySchema.statics.findDescendantIds = function (childrenArray, prevVal = []) {
  return childrenArray.reduce((acc, cur) => {
    if (cur._id) {
      acc.push(cur._id);
    }

    if (Array.isArray(cur.Children)) {
      acc.concat(this.findDescendantIds(cur.Children, acc));
    }

    return acc;
  }, prevVal);
};

categorySchema.statics.findChildren = function (flatArray, parent = { _id: null }) {
  return flatArray.filter((child) => {
    if ((child.Parent === parent._id) || (!child.Parent && parent._id === null)) return true;

    if (!child.Parent || !parent._id) return false;

    return child.Parent.toString() === parent._id.toString();
  });
};

categorySchema.statics.updateChildren = async function (
  flatArray, parent = { _id: null }, newFlatArray = [],
) {
  return new Promise((resolve) => {
    const children = this.findChildren(flatArray, parent);

    if (!_.isEmpty(children)) {
      parent.Children = children;

      children.forEach((child) => {
        newFlatArray.concat(this.updateChildren(flatArray, child, newFlatArray));
      });
    } else {
      parent.Children = [];
    }

    if (parent.Parent && parent.save) {
      parent.save();
      newFlatArray.push(parent);
    }

    resolve(newFlatArray);
  });
};

categorySchema.statics.regenerateTree = async function () {
  const flatArray = await this.find({})
    .exec();
  const topLevel = await this.find({ Parent: null })
    .exec();

  const updatedFlatArray = await this.updateChildren(flatArray);

  topLevel.forEach((category) => {
    category.Children = this.findChildren(updatedFlatArray, category);
    category.save();
  });
};

export default mongoose.model('Category', categorySchema, 'Categories');
