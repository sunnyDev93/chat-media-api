import {Router} from 'express';

import authRoute from './auth.route';
import filesRoute from './files.route';
import booksRoute from './books.route';
import chatMediaRoute from './chatMedia.route';
import checkoutRoute from './checkout.route';

const router = Router();

router.use('/auth', authRoute);
router.use('/files', filesRoute);
router.use('/books', booksRoute);
router.use('/chatMedia', chatMediaRoute);
router.use('/checkout', checkoutRoute);

export default router;
