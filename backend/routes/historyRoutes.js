const express = require('express');
const router = express.Router();
const historyController = require('../controllers/historyController');
const { requireAuth, requireRoles } = require('../middleware/auth.js');

router.get('/', historyController.getAllPeriods);
router.get('/:id', historyController.getPeriodById);
router.post('/', requireAuth, requireRoles('admin'), historyController.createPeriod);
router.put('/:id', requireAuth, requireRoles('admin'), historyController.updatePeriod);
router.delete('/:id', requireAuth, requireRoles('admin'), historyController.deletePeriod);

module.exports = router;
