import express from 'express';
import Controller from './controller';

const router = express.Router();
const USER_BASE_PAH = '/person';

router.get(USER_BASE_PAH, Controller.getAll);
router.get(`${USER_BASE_PAH}/:id`, Controller.getById);
router.post(USER_BASE_PAH, Controller.create);

export default router;
