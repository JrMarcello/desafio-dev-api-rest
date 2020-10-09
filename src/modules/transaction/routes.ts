import express from 'express';
import Controller from './controller';

const router = express.Router();
const USER_BASE_PAH = '/transaction';

router.put(`${USER_BASE_PAH}/deposit`, Controller.deposit);
router.put(`${USER_BASE_PAH}/withdraw`, Controller.withdraw);
router.get(`${USER_BASE_PAH}/:accountId/extract`, Controller.extract);

export default router;
