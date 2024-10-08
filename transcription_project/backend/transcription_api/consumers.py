import json


from channels.generic.websocket import AsyncWebsocketConsumer


from ..utils import transcription, translation


class TranscriptionConsumer(AsyncWebsocketConsumer):


    async def connect(self):


        await self.accept()





    async def disconnect(self, close_code):


        pass





    async def receive(self, text_data):


        text_data_json = json.loads(text_data)


        audio_chunk = text_data_json['audio_chunk']


        target_language = text_data_json.get('target_language', 'en')


        


        transcription_text = transcription.transcribe_audio_chunk(audio_chunk)


        translated_text = translation.translate_text(transcription_text, target_language)





        await self.send(text_data=json.dumps({


            'transcription': transcription_text,


            'translation': translated_text


        }))