import React from 'react';
import { Select, MenuItem, FormControl, InputLabel, Box } from '@material-ui/core';

const LanguageSelector = ({ language, onLanguageChange, languages, label = "Target Language" }) => {
  return (
    <Box>
      <FormControl fullWidth>
        <InputLabel>{label}</InputLabel>
        <Select value={language} onChange={onLanguageChange}>
          {languages.map((lang) => (
            <MenuItem key={lang.code} value={lang.code}>
              {lang.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};

export default LanguageSelector;