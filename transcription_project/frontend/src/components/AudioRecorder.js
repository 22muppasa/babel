import React, { useState, useRef } from 'react';
import { Button, Box, Typography, CircularProgress } from '@material-ui/core';
import { Mic, Stop } from '@material-ui/icons';
import axios from 'axios';

const AudioRecorder = ({ onTranscriptionUpdate, targetLanguage }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const mediaRecorder = useRef(null);
  const audioChunks = useRef([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder.current = new MediaRecorder(stream, { mimeType: 'audio/webm' });
      
      mediaRecorder.current.ondataavailable = (event) => {
        audioChunks.current.push(event.data);
      };

      mediaRecorder.current.start();
      setIsRecording(true);
      setError(null);
    } catch (error) {
      console.error('Error accessing microphone:', error);
      setError('Error accessing microphone. Please check your permissions.');
    }
  };

  const stopRecording = async () => {
    if (mediaRecorder.current) {
      mediaRecorder.current.stop();
      setIsRecording(false);
      setIsProcessing(true);

      mediaRecorder.current.onstop = async () => {
        const audioBlob = new Blob(audioChunks.current, { type: 'audio/webm' });
        const formData = new FormData();
        formData.append('audio', audioBlob, 'recording.webm');
        formData.append('target_language', targetLanguage);

        try {
          const response = await axios.post('http://localhost:8000/api/transcribe/', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
          });
          if (response.data.error) {
            throw new Error(response.data.error);
          }
          onTranscriptionUpdate(response.data.transcription, response.data.translation);
        } catch (error) {
          console.error('Error:', error);
          setError(`Error: ${error.message || 'Unknown error occurred'}`);
        } finally {
          setIsProcessing(false);
          audioChunks.current = [];
        }
      };
    }
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Audio Recorder
      </Typography>
      <Button
        variant="contained"
        color={isRecording ? "secondary" : "primary"}
        startIcon={isRecording ? <Stop /> : <Mic />}
        onClick={isRecording ? stopRecording : startRecording}
        disabled={isProcessing}
      >
        {isRecording ? 'Stop Recording' : 'Start Recording'}
      </Button>
      {isProcessing && <CircularProgress size={24} style={{ marginLeft: 10 }} />}
      {error && (
        <Typography color="error" style={{ marginTop: 10 }}>
          {error}
        </Typography>
      )}
    </Box>
  );
};

export default AudioRecorder;