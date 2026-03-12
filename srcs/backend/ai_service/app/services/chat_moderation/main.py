from transformers import pipeline

moderator = pipeline("text-classification", model="koalaAI/Text-Moderation", top_k=None)


def moderate_text(text: str):
    result = moderator(text)
    return result


print(moderate_text(input("Enter Text: ")))
