import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

const API_BASE_URL = 'http://localhost:8000';
const EMOJIS = ['😄', '😠', '😭', '🥳'];

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedEmoji, setSelectedEmoji] = useState('😄');
  const [convertedImage, setConvertedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewImage(e.target.result);
      };
      reader.readAsDataURL(file);
      setConvertedImage(null);
    }
  };

  const handleEmojiSelect = (emoji) => {
    setSelectedEmoji(emoji);
  };

  const handleConvert = async () => {
    if (!selectedFile) {
      alert('Please select an image first!');
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await axios.post(
        `${API_BASE_URL}/convert?emoji=${encodeURIComponent(selectedEmoji)}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          responseType: 'blob',
        }
      );

      const imageBlob = new Blob([response.data], { type: 'image/png' });
      const imageUrl = URL.createObjectURL(imageBlob);
      setConvertedImage(imageUrl);
    } catch (error) {
      console.error('Error converting image:', error);
      alert('Failed to convert image. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const downloadImage = () => {
    if (convertedImage) {
      const link = document.createElement('a');
      link.href = convertedImage;
      link.download = `emoji-profile-${selectedEmoji}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>🎭 Emoji Profile Maker</h1>
        <p>Transform your profile image with emoji moods!</p>
      </header>

      <main className="App-main">
        <div className="upload-section">
          <h2>1. Upload Your Image</h2>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="file-input"
            id="file-input"
          />
          <label htmlFor="file-input" className="file-label">
            Choose Image
          </label>
          {previewImage && (
            <div className="image-preview">
              <img src={previewImage} alt="Preview" />
            </div>
          )}
        </div>

        <div className="emoji-section">
          <h2>2. Choose Your Mood</h2>
          <div className="emoji-grid">
            {EMOJIS.map((emoji) => (
              <button
                key={emoji}
                className={`emoji-button ${selectedEmoji === emoji ? 'selected' : ''}`}
                onClick={() => handleEmojiSelect(emoji)}
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>

        <div className="convert-section">
          <h2>3. Transform Your Image</h2>
          <button
            onClick={handleConvert}
            disabled={!selectedFile || loading}
            className="convert-button"
          >
            {loading ? 'Converting...' : `Convert to ${selectedEmoji}`}
          </button>
        </div>

        {convertedImage && (
          <div className="result-section">
            <h2>4. Your New Profile Image</h2>
            <div className="result-container">
              <div className="image-comparison">
                {previewImage && (
                  <div className="image-container">
                    <h3>Original</h3>
                    <img src={previewImage} alt="Original" />
                  </div>
                )}
                <div className="image-container">
                  <h3>Converted {selectedEmoji}</h3>
                  <img src={convertedImage} alt="Converted" />
                </div>
              </div>
              <button onClick={downloadImage} className="download-button">
                Download Image
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;