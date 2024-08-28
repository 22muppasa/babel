import React from 'react';
import { Paper, Typography, Box } from '@material-ui/core';

const TranslationDisplay = ({ translation }) => {
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Translation
      </Typography>
      <Paper style={{ padding: '1rem', backgroundColor: '#1e1e1e' }}>
        <Typography variant="body1">
          {translation || 'No translation available'}
        </Typography>
      </Paper>
    </Box>
  );
};

export default TranslationDisplay;