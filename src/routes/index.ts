import { Router } from 'express';

import authRoute from './auth.route';
import filesRoute from './files.route';
import booksRoute from './books.route';

const router = Router();

router.use('/auth', authRoute);
router.use('/files', filesRoute);
router.use('/books', booksRoute);
router.use('/auth', authRoute);

export default router;
