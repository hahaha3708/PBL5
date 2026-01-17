// AI Controller - Handles AI-powered features like calligraphy and image restoration
const AIArt = require('../models/aiModel');

exports.generateCalligraphy = async (req, res) => {
  try {
    const { text, style } = req.body;
    const result = await AIArt.generateCalligraphy(text, style);
    res.json({ imageUrl: result });
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate calligraphy' });
  }
};

exports.restoreImage = async (req, res) => {
  try {
    const { imageData } = req.body;
    const restoredImage = await AIArt.restoreImage(imageData);
    res.json({ restoredImageUrl: restoredImage });
  } catch (error) {
    res.status(500).json({ error: 'Failed to restore image' });
  }
};

exports.textToSpeech = async (req, res) => {
  try {
    const { text, language } = req.body;
    const audioUrl = await AIArt.textToSpeech(text, language);
    res.json({ audioUrl });
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate speech' });
  }
};

exports.getAIHistory = async (req, res) => {
  try {
    const userId = req.params.userId;
    const history = await AIArt.getUserHistory(userId);
    res.json(history);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch AI history' });
  }
};
