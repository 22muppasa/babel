import React from 'react';
import { Paper, Typography, Box } from '@material-ui/core';

const TranscriptionDisplay = ({ transcription }) => {
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Transcription
      </Typography>
      <Paper style={{ padding: '1rem', backgroundColor: '#1e1e1e' }}>
        <Typography variant="body1">
          {transcription || 'No transcription available'}
        </Typography>
      </Paper>
    </Box>
  );
};

export default TranscriptionDisplay;