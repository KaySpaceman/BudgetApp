import express from 'express';
import { getCategoryTree, getCategories } from '../services/database/repository.mjs';

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

export default router;
