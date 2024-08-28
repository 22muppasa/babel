import React, { useState } from 'react';
import { Button, Typography, Box, CircularProgress } from '@material-ui/core';
import { CloudUpload } from '@material-ui/icons';
import axios from 'axios';

const FileUploader = ({ onTranscriptionUpdate, targetLanguage }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert('Please select a file first!');
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append('audio', selectedFile);
    formData.append('target_language', targetLanguage);

    try {
      const response = await axios.post('http://localhost:8000/api/transcribe/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      onTranscriptionUpdate(response.data.transcription, response.data.translation);
      setSelectedFile(null);
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Error uploading file. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        File Upload
      </Typography>
      <input
        accept="audio/*"
        style={{ display: 'none' }}
        id="contained-button-file"
        type="file"
        onChange={handleFileChange}
      />
      <label htmlFor="contained-button-file">
        <Button variant="contained" color="primary" component="span">
          Select Audio File
        </Button>
      </label>
      {selectedFile && (
        <Typography variant="body2">
          Selected file: {selectedFile.name}
        </Typography>
      )}
      <Box mt={2}>
        <Button 
          onClick={handleUpload} 
          disabled={!selectedFile || isUploading}
          variant="contained"
          color="secondary"
          startIcon={isUploading ? <CircularProgress size={24} /> : <CloudUpload />}
        >
          {isUploading ? 'Uploading...' : 'Upload and Transcribe'}
        </Button>
      </Box>
    </Box>
  );
};

export default FileUploader;