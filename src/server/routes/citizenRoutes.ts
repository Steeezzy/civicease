import { Router } from 'express';
// We need to import the middleware from index.ts or move middleware to a separate file.
// For now, I'll assume I can pass them or I'll just refactor index.ts to export them.
// To keep it clean, I will just defined them here or expect the main router to apply them.
// Actually, best practice is separate middleware file.
// But to follow the single-prompt scope, I'll export the router and apply middleware in index.ts

import * as CitizenController from '../controllers/citizenController';

const router = Router();

// Routes
router.get('/', CitizenController.listCitizens);
router.post('/', CitizenController.createCitizen);
router.get('/:id', CitizenController.getCitizen);
router.put('/:id', CitizenController.updateCitizen);

export default router;
