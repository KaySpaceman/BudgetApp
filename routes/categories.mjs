import express from 'express';
import {
  getCategoryTree,
  getCategories,
  createCategory,
  regenerateTree,
} from '../services/database/repository.mjs';

const router = express.Router();

router.get('/', (req, res) => {
  Promise.all([getCategoryTree(), getCategories()])
    .then((result) => {
      res.render('categories', {
        topLevel: result[0],
        flatList: result[1],
      });
    });
});

router.post('/new', (req, res) => {
  const name = req.param('name');

  if (!name) {
    res.redirect('/');
  }

  createCategory(name, req.param('new'))
    .then(() => {
      regenerateTree()
        .then(() => {
          res.redirect('/categories');
        });
    });
});

export default router;
