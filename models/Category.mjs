/* eslint-disable no-underscore-dangle, no-param-reassign, func-names */
import mongoose from 'mongoose';
import _ from 'lodash';

const categorySchema = new mongoose.Schema({
  _id: mongoose.ObjectId,
  Name: String,
  Parent: mongoose.ObjectId,
  Children: Array,
});

categorySchema.statics.findChildren = function (flatArray, parent = { _id: null }, tree = []) {
  const children = flatArray.filter((child) => {
    if (child.Parent === parent._id) return true;

    if (!child.Parent || !parent._id) return false;

    return child.Parent.toString() === parent._id.toString();
  });

  if (!_.isEmpty(children)) {
    if (parent._id === null) {
      tree = children;
    } else {
      parent.Children = children;
    }

    children.forEach((child) => {
      this.findChildren(flatArray, child);
    });
  }

  if (parent.save) parent.save();

  return tree;
};

categorySchema.statics.regenerateTree = function () {
  return new Promise((resolve) => {
    this.find({})
      .exec()
      .then((flatArray) => {
        const tree = this.model('Category')
          .findChildren(flatArray);

        resolve(tree);
      });
  });
};

export default mongoose.model('Category', categorySchema, 'Categories');
