// Map Controller - Handles map and heritage sites operations
const MapSite = require('../models/mapModel');

exports.getAllSites = async (req, res) => {
  try {
    const sites = await MapSite.findAll();
    res.json(sites);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch sites' });
  }
};

exports.getSiteById = async (req, res) => {
  try {
    const site = await MapSite.findById(req.params.id);
    if (!site) {
      return res.status(404).json({ error: 'Site not found' });
    }
    res.json(site);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch site' });
  }
};

exports.getSitesByRegion = async (req, res) => {
  try {
    const region = req.params.region;
    const sites = await MapSite.findByRegion(region);
    res.json(sites);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch sites by region' });
  }
};

exports.createSite = async (req, res) => {
  try {
    const newSite = await MapSite.create(req.body);
    res.status(201).json(newSite);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create site' });
  }
};

exports.updateSite = async (req, res) => {
  try {
    const updatedSite = await MapSite.update(req.params.id, req.body);
    if (!updatedSite) {
      return res.status(404).json({ error: 'Site not found' });
    }
    res.json(updatedSite);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update site' });
  }
};

exports.deleteSite = async (req, res) => {
  try {
    const deleted = await MapSite.delete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: 'Site not found' });
    }
    res.json({ message: 'Site deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete site' });
  }
};
