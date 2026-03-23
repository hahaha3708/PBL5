const express = require('express');
const router = express.Router();
const heritageController = require('../controllers/heritageController');
const { requireAuth, requireRoles } = require('../middleware/auth.js');

router.get('/', heritageController.getAllSites);
router.get('/:id', heritageController.getSiteById);
router.post('/', requireAuth, requireRoles('admin'), heritageController.createSite);
router.put('/:id', requireAuth, requireRoles('admin'), heritageController.updateSite);
router.delete('/:id', requireAuth, requireRoles('admin'), heritageController.deleteSite);
router.post('/:id/media', requireAuth, requireRoles('admin'), heritageController.addMedia);

module.exports = router;
