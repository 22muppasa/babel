from django.urls import path
from . import views

urlpatterns = [
    path('', views.api_root, name='api_root'),
    path('transcribe/', views.TranscribeAudioView.as_view(), name='transcribe_audio'),
    path('translate/', views.TranslateTextView.as_view(), name='translate_text'),
    path('youtube-transcribe/', views.YouTubeTranscriptionView.as_view(), name='youtube_transcribe'),
    path('text-to-speech/', views.TextToSpeechView.as_view(), name='text_to_speech'),
]