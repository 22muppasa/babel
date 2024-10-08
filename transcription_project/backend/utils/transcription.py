import whisper
import numpy as np
import io
import logging
from pydub import AudioSegment
import os

logger = logging.getLogger(__name__)

model = whisper.load_model("base")

def transcribe_audio(audio_file):
    logger.info(f"Starting transcription of file: {audio_file}")
    try:
        # Check if audio_file is a string (file path) or a file-like object
        if isinstance(audio_file, str):
            # It's a file path, so we need to open it
            with open(audio_file, 'rb') as f:
                audio_data = f.read()
            format = os.path.splitext(audio_file)[1][1:].lower()  # Get file extension
        else:
            # It's a file-like object, so we can read it directly
            audio_file.seek(0)
            audio_data = audio_file.read()
            format = audio_file.name.split('.')[-1].lower()

        # Default to wav if unknown format
        if format not in ['wav', 'mp3', 'ogg', 'webm']:
            format = 'wav'

        # Use pydub to load the audio data
        audio = AudioSegment.from_file(io.BytesIO(audio_data), format=format)

        # Convert to mono if stereo
        if audio.channels > 1:
            audio = audio.set_channels(1)

        # Resample to 16kHz if necessary
        if audio.frame_rate != 16000:
            audio = audio.set_frame_rate(16000)

        # Convert to numpy array
        samples = np.array(audio.get_array_of_samples())
        
        # Normalize the audio
        if samples.dtype != np.float32:
            samples = samples.astype(np.float32)
        
        if np.max(np.abs(samples)) > 1.0:
            samples = samples / np.max(np.abs(samples))

        logger.info(f"Audio data prepared. Shape: {samples.shape}, dtype: {samples.dtype}")

        # Transcribe the audio
        logger.info("Starting Whisper transcription")
        result = model.transcribe(samples)
        logger.info("Whisper transcription completed")
        return result["text"]
    except Exception as e:
        logger.error(f"Error in transcribe_audio: {str(e)}", exc_info=True)
        raise

def transcribe_audio_chunk(audio_chunk):
    # This function remains unchanged
    result = model.transcribe(audio_chunk)
    return result["text"]