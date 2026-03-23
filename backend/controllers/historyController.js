const HistoricalPeriod = require('../models/historyModel');

exports.getAllPeriods = async (req, res) => {
  try {
    const periods = await HistoricalPeriod.findAll();
    res.json(periods);
  } catch (err) {
    console.error('API Error (History):', err);
    res.status(500).json({ error: 'Failed to fetch historical periods' });
  }
};

exports.getPeriodById = async (req, res) => {
  try {
    const period = await HistoricalPeriod.findById(req.params.id);
    if (!period) return res.status(404).json({ error: 'Period not found' });
    res.json(period);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch period details' });
  }
};

exports.createPeriod = async (req, res) => {
  try {
    const newPeriod = await HistoricalPeriod.create(req.body);
    res.status(201).json(newPeriod);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create period' });
  }
};

exports.updatePeriod = async (req, res) => {
  try {
    const success = await HistoricalPeriod.update(req.params.id, req.body);
    if (!success) return res.status(404).json({ error: 'Period not found' });
    res.json({ message: 'Period updated' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update period' });
  }
};

exports.deletePeriod = async (req, res) => {
  try {
    const success = await HistoricalPeriod.delete(req.params.id);
    if (!success) return res.status(404).json({ error: 'Period not found' });
    res.json({ message: 'Period deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete period' });
  }
};
