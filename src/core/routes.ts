import express from 'express';

import personRouters from '../modules/person/routes';
import accountRouters from '../modules/account/routes';
import transactionRouters from '../modules/transaction/routes';

const router = express.Router();
router.use('/v1', [personRouters, accountRouters, transactionRouters]);

export default router;
