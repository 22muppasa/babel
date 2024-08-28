import React, { useState } from 'react';
import { ThemeProvider, createTheme } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import AudioRecorder from './components/AudioRecorder';
import FileUploader from './components/FileUploader';
import TranscriptionDisplay from './components/TranscriptionDisplay';
import TranslationDisplay from './components/TranslationDisplay';
import LanguageSelector from './components/LanguageSelector';
import YouTubeInput from './components/YouTubeInput';
import TextToSpeech from './components/TextToSpeech';

const darkTheme = createTheme({
  palette: {
    type: 'dark',
    background: {
      default: '#000',
    },
    primary: {
      main: '#1976d2',
    },
  },
  shape: {
    borderRadius: 8,
  },
});

const languages = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'it', name: 'Italian' },
  { code: 'pt', name: 'Portuguese' },
  { code: 'ru', name: 'Russian' },
  { code: 'ja', name: 'Japanese' },
  { code: 'ko', name: 'Korean' },
  { code: 'zh-cn', name: 'Chinese (Simplified)' },
];

function App() {
  const [transcription, setTranscription] = useState('');
  const [translation, setTranslation] = useState('');
  const [targetLanguage, setTargetLanguage] = useState('en');

  const handleTranscriptionUpdate = (newTranscription, newTranslation) => {
    setTranscription(newTranscription);
    setTranslation(newTranslation);
  };

  const handleLanguageChange = (event) => {
    setTargetLanguage(event.target.value);
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Container maxWidth="md">
        <Box my={4}>
          <Typography variant="h3" component="h1" gutterBottom>
            Audio Transcription and Translation
          </Typography>

          <Box mb={3}>
            <AudioRecorder 
              onTranscriptionUpdate={handleTranscriptionUpdate} 
              targetLanguage={targetLanguage}
            />
          </Box>

          <Box mb={3}>
            <FileUploader 
              onTranscriptionUpdate={handleTranscriptionUpdate} 
              targetLanguage={targetLanguage}
            />
          </Box>

          <Box mb={3}>
            <YouTubeInput 
              onTranscriptionUpdate={handleTranscriptionUpdate}
              targetLanguage={targetLanguage}
            />
          </Box>

          <Box mb={3}>
            <TranscriptionDisplay transcription={transcription} />
          </Box>

          <Box mb={3}>
            <TranslationDisplay translation={translation} />
          </Box>

          <Box mb={3}>
            <LanguageSelector 
              language={targetLanguage} 
              onLanguageChange={handleLanguageChange}
              languages={languages}
            />
          </Box>

          <Box mb={3}>
            <TextToSpeech text={translation || transcription} lang={targetLanguage} />
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default App;