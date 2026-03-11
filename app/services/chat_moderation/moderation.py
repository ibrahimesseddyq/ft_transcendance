from transformers import AutoModelForSequenceClassification, AutoTokenizer

model = AutoModelForSequenceClassification.from_pretrained("KoalaAI/Text-Moderation")
tokenizer = AutoTokenizer.from_pretrained("KoalaAI/Text-Moderation")

while True:
    inputs = tokenizer(input("Enter the text: "), return_tensors="pt")
    outputs = model(**inputs)

    logits = outputs.logits

    probabilities = logits.softmax(dim=-1).squeeze()
    # print(probabilities.tolist())

    id2label = model.config.id2label
    labels = [id2label[idx] for idx in range(len(probabilities))]
    # print(labels)

    label_prob_pairs = list(zip(labels, probabilities))
    # print(label_prob_pairs)
    label_prob_pairs.sort(key=lambda item: item[1], reverse=True)

    for label, probability in label_prob_pairs:
        print(f"Label: {label} - Probability: {probability:.4f}")
