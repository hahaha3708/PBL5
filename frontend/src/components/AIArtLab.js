import React, { useState } from 'react';
import axios from 'axios';
import './AIArtLab.css';

function AIArtLab() {
  const [calligraphyText, setCalligraphyText] = useState('');
  const [calligraphyStyle, setCalligraphyStyle] = useState('traditional');
  const [generatedCalligraphy, setGeneratedCalligraphy] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [restoredImage, setRestoredImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleCalligraphyGeneration = async () => {
    if (!calligraphyText.trim()) return;

    setIsLoading(true);
    try {
      const response = await axios.post('/api/ai/calligraphy', {
        text: calligraphyText,
        style: calligraphyStyle
      });
      setGeneratedCalligraphy(response.data.imageUrl);
    } catch (error) {
      console.error('Error generating calligraphy:', error);
      alert('Failed to generate calligraphy. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImageFile(file);
    }
  };

  const handleImageRestoration = async () => {
    if (!imageFile) return;

    setIsLoading(true);
    const formData = new FormData();
    formData.append('image', imageFile);

    try {
      const response = await axios.post('/api/ai/restore-image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setRestoredImage(response.data.restoredImageUrl);
    } catch (error) {
      console.error('Error restoring image:', error);
      alert('Failed to restore image. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="ai-art-lab">
      <h2>AI Art Lab</h2>

      <div className="art-section">
        <h3>Generate Calligraphy</h3>
        <div className="calligraphy-form">
          <input
            type="text"
            placeholder="Enter text for calligraphy"
            value={calligraphyText}
            onChange={(e) => setCalligraphyText(e.target.value)}
          />
          <select value={calligraphyStyle} onChange={(e) => setCalligraphyStyle(e.target.value)}>
            <option value="traditional">Traditional</option>
            <option value="modern">Modern</option>
            <option value="cursive">Cursive</option>
          </select>
          <button onClick={handleCalligraphyGeneration} disabled={isLoading}>
            {isLoading ? 'Generating...' : 'Generate Calligraphy'}
          </button>
        </div>
        {generatedCalligraphy && (
          <div className="result">
            <img src={generatedCalligraphy} alt="Generated Calligraphy" />
            <a href={generatedCalligraphy} download>Download</a>
          </div>
        )}
      </div>

      <div className="art-section">
        <h3>Restore Historical Images</h3>
        <div className="image-restoration-form">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
          />
          <button onClick={handleImageRestoration} disabled={isLoading || !imageFile}>
            {isLoading ? 'Restoring...' : 'Restore Image'}
          </button>
        </div>
        {imageFile && (
          <div className="original-image">
            <h4>Original Image:</h4>
            <img src={URL.createObjectURL(imageFile)} alt="Original" />
          </div>
        )}
        {restoredImage && (
          <div className="result">
            <h4>Restored Image:</h4>
            <img src={restoredImage} alt="Restored Image" />
            <a href={restoredImage} download>Download</a>
          </div>
        )}
      </div>

      <div className="usage-note">
        <p><strong>Note:</strong> Free users get watermarked results. Upgrade to premium for high-quality downloads.</p>
      </div>
    </div>
  );
}

export default AIArtLab;
