import {Router} from 'express';

import authRoute from './auth.route';
import filesRoute from './files.route';
import chatMediaRoute from './chatMedia.route';
import checkoutRoute from './checkout.route';
import price from './price.route';

const router = Router();

router.use('/auth', authRoute);
router.use('/files', filesRoute);
router.use('/chatMedia', chatMediaRoute);
router.use('/checkout', checkoutRoute);
router.use('/price', price);

export default router;
