import React, { useState } from 'react';
import { TextField, Button, CircularProgress, Box, Typography } from '@material-ui/core';
import { YouTube as YouTubeIcon } from '@material-ui/icons';
import axios from 'axios';

const YouTubeInput = ({ onTranscriptionUpdate, targetLanguage }) => {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await axios.post('http://localhost:8000/api/youtube-transcribe/', {
        youtube_url: url,
        target_language: targetLanguage
      });
      onTranscriptionUpdate(response.data.transcription, response.data.translation);
      setUrl('');  // Clear the input after successful submission
    } catch (error) {
      console.error('Error transcribing YouTube video:', error);
      setError('Error transcribing YouTube video. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        YouTube Video Transcription
      </Typography>
      <form onSubmit={handleSubmit}>
        <Box display="flex" alignItems="center" mb={2}>
          <TextField
            fullWidth
            label="YouTube URL"
            variant="outlined"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            disabled={isLoading}
            error={!!error}
            helperText={error}
          />
          <Box ml={2}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={!url || isLoading}
              startIcon={isLoading ? <CircularProgress size={24} /> : <YouTubeIcon />}
            >
              {isLoading ? 'Processing...' : 'Transcribe'}
            </Button>
          </Box>
        </Box>
      </form>
      <Typography variant="body2" color="textSecondary">
        Paste a YouTube URL to transcribe and translate the video's audio.
      </Typography>
    </Box>
  );
};

export default YouTubeInput;