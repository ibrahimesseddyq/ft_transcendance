from faster_whisper import WhisperModel

model_size = "small.en"

model = WhisperModel(model_size, device="cpu", compute_type="float32")


def recognate(audio_file):
    segments, _ = model.transcribe(audio_file, beam_size=5)

    text = ""
    for segment in segments:
        text += segment.text

    return text
