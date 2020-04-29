import express from 'express';
import { getCategoryTree } from '../services/database/repository.mjs';

const router = express.Router();

router.get('/', (req, res) => {
  getCategoryTree()
    .then((categories) => {
      res.render('categories', {
        categories,
      });
    });
});

export default router;
