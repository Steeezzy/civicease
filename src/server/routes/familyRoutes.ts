import { Router } from 'express';
import * as FamilyController from '../controllers/familyController';

const router = Router();

router.get('/', FamilyController.listFamilies);
router.post('/', FamilyController.createFamily);
router.get('/:id', FamilyController.getFamily);
router.post('/:id/members', FamilyController.addMember);
router.delete('/:id/members/:citizenId', FamilyController.removeMember);

export default router;
