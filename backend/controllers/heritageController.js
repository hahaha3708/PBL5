const HeritageSite = require('../models/heritageModel');

exports.getAllSites = async (req, res) => {
  try {
    const sites = await HeritageSite.findAll();
    res.json(sites);
  } catch (err) {
    console.error('API Error (Map):', err);
    res.status(500).json({ error: 'Failed to fetch sites' });
  }
};

exports.getSiteById = async (req, res) => {
  try {
    const site = await HeritageSite.findById(req.params.id);
    if (!site) return res.status(404).json({ error: 'Site not found' });
    
    // Also fetch media
    const media = await HeritageSite.getMedia(req.params.id);
    res.json({ ...site, media });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch site details' });
  }
};

exports.createSite = async (req, res) => {
  try {
    const newSite = await HeritageSite.create(req.body);
    res.status(201).json(newSite);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create site' });
  }
};

exports.updateSite = async (req, res) => {
  try {
    const success = await HeritageSite.update(req.params.id, req.body);
    if (!success) return res.status(404).json({ error: 'Site not found' });
    res.json({ message: 'Site updated' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update site' });
  }
};

exports.deleteSite = async (req, res) => {
  try {
    const success = await HeritageSite.delete(req.params.id);
    if (!success) return res.status(404).json({ error: 'Site not found' });
    res.json({ message: 'Site deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete site' });
  }
};

exports.addMedia = async (req, res) => {
  try {
    const media = await HeritageSite.addMedia(req.params.id, req.body);
    res.status(201).json(media);
  } catch (err) {
    res.status(500).json({ error: 'Failed to add media' });
  }
};
