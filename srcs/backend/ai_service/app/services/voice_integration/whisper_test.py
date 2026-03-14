from faster_whisper import WhisperModel

model_size = "small.en"

model = WhisperModel(model_size, device="cpu", compute_type="float32")

segments, info = model.transcribe("whisper-audio-test.m4a", beam_size=5)

print(model.transcribe("whisper-audio-test.m4a", beam_size=5)[0].text, end="\n\n")

for segment in segments:
    print("[%.2fs -> %.2fs] %s" % (segment.start, segment.end, segment.text))
