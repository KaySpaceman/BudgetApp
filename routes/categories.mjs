import express from 'express';
import {
  getCategoryTree,
  createCategory,
  deleteCategory,
} from '../services/database/repository.mjs';

const router = express.Router();

router.get('/', (req, res) => {
  getCategoryTree()
    .then((tree) => {
      const flatList = tree.map((x) => x);
      flatList.unshift({
        _id: null,
        Name: 'Root',
      });

      res.render('categories', {
        topLevel: tree,
        flatList,
      });
    });
});

router.post('/new', (req, res) => {
  const name = req.param('name');

  if (!name) {
    res.redirect('/');
  }

  createCategory(name, req.param('new'))
    .then(() => res.redirect('/categories'));
});

router.post('/delete', (req, res) => {
  const categoryId = req.param('Id');

  if (!categoryId) res.redirect('/categories');

  deleteCategory(categoryId)
    .then(() => res.redirect('/categories'));
});

export default router;