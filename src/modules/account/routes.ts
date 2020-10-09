import express from 'express';
import Controller from './controller';

const router = express.Router();
const USER_BASE_PAH = '/account';

router.get(USER_BASE_PAH, Controller.getAll);
router.get(`${USER_BASE_PAH}/:id`, Controller.getById);
router.get(`${USER_BASE_PAH}/person/:idPerson`, Controller.getByPersonId);

router.post(USER_BASE_PAH, Controller.create);
router.get(`${USER_BASE_PAH}/:id/balance`, Controller.balance);
router.put(`${USER_BASE_PAH}/:id/block`, Controller.block);

export default router;
