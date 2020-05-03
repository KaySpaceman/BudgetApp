import express from 'express';
import { getCategoryTree } from '../services/database/repository.mjs';
import { getCategories } from '../services/database/repository.mjs';

const router = express.Router();

router.get('/', (req, res) => {
  getCategoryTree()
    .then((topLevel) => {
      res.render('categories', {
        topLevel,
      });
    });
});

export default router;
