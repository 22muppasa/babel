import React, { useState } from 'react';
import { Button, CircularProgress, Box, Typography } from '@material-ui/core';
import { VolumeUp } from '@material-ui/icons';
import axios from 'axios';

const TextToSpeech = ({ text, lang }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleSpeak = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post('http://localhost:8000/api/text-to-speech/', 
        { text, lang },
        { responseType: 'blob' }
      );
      const audioUrl = URL.createObjectURL(new Blob([response.data]));
      const audio = new Audio(audioUrl);
      await audio.play();
    } catch (error) {
      console.error('Error in text-to-speech:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Text-to-Speech
      </Typography>
      <Button 
        onClick={handleSpeak} 
        disabled={isLoading || !text}
        variant="contained"
        color="primary"
        startIcon={isLoading ? <CircularProgress size={24} /> : <VolumeUp />}
      >
        {isLoading ? 'Speaking...' : 'Speak Text'}
      </Button>
    </Box>
  );
};

export default TextToSpeech;