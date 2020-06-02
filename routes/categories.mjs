/* eslint-disable no-underscore-dangle */
import express from 'express';
import {
  getCategoryTree,
  createCategory,
  deleteCategory,
} from '../services/database/repository.mjs';
import { flattenArray } from '../services/utility/formatter.mjs';

const router = express.Router();

router.get('/', async (req, res) => {
  const rawTree = await getCategoryTree();
  const categoryTree = rawTree.map((x) => x._doc);
  const flatCategories = categoryTree.reduce(
    (acc, cur) => {
      acc.push(cur);
      return acc.concat(flattenArray(cur.Children, 'Children'));
    },
    [],
  );

  flatCategories.unshift({
    _id: null,
    IdString: '',
    Name: 'Root',
  });

  res.renderVue('Categories.vue', {
    categoryTree,
    flatCategories,
  }, {
    head: {
      title: 'Transaction Categories',
      styles: [
        { style: 'https://cdn.jsdelivr.net/npm/select2@4.0.13/dist/css/select2.min.css' },
      ],
      scripts: [
        { src: 'https://code.jquery.com/jquery-3.5.0.min.js' },
        { src: 'https://cdn.jsdelivr.net/npm/select2@4.0.13/dist/js/select2.min.js' },
      ],
    },
  });
});

router.post('/new', (req, res) => {
  const name = req.param('name');

  if (!name) {
    res.redirect('/');
  }

  createCategory(name, req.param('create'))
    .then(() => res.redirect('/categories'));
});

router.post('/delete', (req, res) => {
  const categoryId = req.param('Id');

  if (!categoryId) res.redirect('/categories');

  deleteCategory(categoryId)
    .then(() => res.redirect('/categories'));
});

export default router;
