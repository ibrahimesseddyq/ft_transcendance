from transformers import pipeline

moderator = pipeline(
    "text-classification", model="Vrandan/Comment-Moderation", top_k=None
)


def moderate(text):
    result_1 = moderator(text)

    result_2 = {
        "hate": sum(
            dict["score"] for dict in result_1[0] if dict["label"] in ["H", "H2", "HR"]
        ),
    }
    result_2.update(
        {
            "violence": sum(
                dict["score"] for dict in result_1[0] if dict["label"] in ["V", "V2"]
            ),
        }
    )
    result_2.update(
        {
            "sexual": sum(
                dict["score"] for dict in result_1[0] if dict["label"] in ["S", "S3"]
            ),
        }
    )

    return result_2
