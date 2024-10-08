from deep_translator import GoogleTranslator
import logging

logger = logging.getLogger(__name__)

def translate_text(text, target_language='en'):
    logger.info(f"Starting translation to {target_language}")
    try:
        translator = GoogleTranslator(source='auto', target=target_language)
        translated_text = translator.translate(text)
        if translated_text is None:
            logger.error("Translation returned None")
            return "Translation error occurred"
        logger.info(f"Translation completed. Length: {len(translated_text)} characters")
        return translated_text
    except Exception as e:
        logger.error(f"Error in translation: {str(e)}")
        return f"Translation error: {str(e)}"