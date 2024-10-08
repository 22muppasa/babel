from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser
from django.http import HttpResponse
from utils import transcription, translation, youtube_download
from gtts import gTTS
import io
from rest_framework.decorators import api_view
from rest_framework.reverse import reverse

@api_view(['GET'])
def api_root(request, format=None):
    return Response({
        'transcribe': reverse('transcribe_audio', request=request, format=format),
        'translate': reverse('translate_text', request=request, format=format),
        'youtube_transcribe': reverse('youtube_transcribe', request=request, format=format),
        'text_to_speech': reverse('text_to_speech', request=request, format=format),
    })
import logging
import traceback

logger = logging.getLogger(__name__)

import logging
import traceback
from django.core.files.uploadedfile import TemporaryUploadedFile

logger = logging.getLogger(__name__)

class TranscribeAudioView(APIView):
    parser_classes = (MultiPartParser,)

    def post(self, request):
        logger.info("TranscribeAudioView post method called")
        audio_file = request.FILES.get('audio')
        target_language = request.data.get('target_language', 'en')

        logger.info(f"Received request - Audio file: {audio_file}, Target language: {target_language}")

        if not audio_file:
            logger.warning("No audio file provided")
            return Response({"error": "No audio file provided"}, status=400)

        try:
            logger.info(f"Audio file details: name={audio_file.name}, size={audio_file.size}, content_type={audio_file.content_type}")

            logger.info("Starting transcription")
            transcription_text = transcription.transcribe_audio(audio_file)
            if not transcription_text:
                return Response({"error": "Transcription failed"}, status=500)
            logger.info(f"Transcription completed: {transcription_text[:100]}...")  # Log first 100 chars

            logger.info("Starting translation")
            translated_text = translation.translate_text(transcription_text, target_language)
            if not translated_text:
                return Response({"error": "Translation failed"}, status=500)
            logger.info(f"Translation completed: {translated_text[:100]}...")  # Log first 100 chars

            return Response({
                "transcription": transcription_text,
                "translation": translated_text
            })
        except Exception as e:
            logger.error(f"Error in transcription/translation: {str(e)}")
            logger.error(traceback.format_exc())  # Log the full traceback
            return Response({"error": f"An error occurred: {str(e)}"}, status=500)

class TranslateTextView(APIView):
    def post(self, request):
        text = request.data.get('text')
        target_language = request.data.get('target_language', 'en')
        
        if not text:
            return Response({"error": "No text provided"}, status=400)

        try:
            translated_text = translation.translate_text(text, target_language)
            return Response({"translation": translated_text})
        except Exception as e:
            return Response({"error": str(e)}, status=500)

import os

class YouTubeTranscriptionView(APIView):
    def post(self, request):
        youtube_url = request.data.get('youtube_url')
        target_language = request.data.get('target_language', 'en')
        
        if not youtube_url:
            return Response({"error": "No YouTube URL provided"}, status=400)

        try:
            logger.info(f"Downloading audio from YouTube URL: {youtube_url}")
            audio_file = youtube_download.download_youtube_audio(youtube_url)
            logger.info(f"Audio downloaded successfully: {audio_file}")

            logger.info("Starting transcription")
            transcription_text = transcription.transcribe_audio(audio_file)
            logger.info(f"Transcription completed: {transcription_text[:100]}...")  # Log first 100 chars

            logger.info(f"Starting translation to {target_language}")
            translated_text = translation.translate_text(transcription_text, target_language)
            logger.info(f"Translation completed: {translated_text[:100]}...")  # Log first 100 chars

            # Clean up the temporary audio file
            os.remove(audio_file)
            logger.info(f"Temporary audio file removed: {audio_file}")

            return Response({
                "transcription": transcription_text,
                "translation": translated_text
            })
        except Exception as e:
            logger.error(f"Error in YouTube transcription: {str(e)}", exc_info=True)
            return Response({"error": str(e)}, status=500)


class TextToSpeechView(APIView):
    def post(self, request):
        text = request.data.get('text')
        lang = request.data.get('lang', 'en')
        
        if not text:
            return Response({"error": "No text provided"}, status=400)

        try:
            # Create a gTTS object
            tts = gTTS(text=text, lang=lang)
            
            # Save audio to a bytes buffer
            fp = io.BytesIO()
            tts.write_to_fp(fp)
            fp.seek(0)

            # Send the audio file as a response
            return HttpResponse(fp, content_type='audio/mp3')
        except Exception as e:
            return Response({"error": str(e)}, status=500)