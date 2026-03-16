import cv2
import numpy
from tensorflow.keras import layers
from tensorflow.keras.applications.resnet import ResNet50
from tensorflow.keras.models import Sequential

model = ResNet50(weights="imagenet", include_top=False, input_shape=(224, 224, 3))

model.trainable = False

model = Sequential(
    [
        model,
        layers.GlobalAveragePooling2D(),
        layers.Dense(128, activation="relu"),
        layers.Dropout(0.5),
        layers.Dense(2, activation="softmax"),
    ]
)

model.load_weights("services/profile_classifier/profile_classf_model.weights.h5")


def predict(image_bytes):
    image = numpy.frombuffer(image_bytes, numpy.uint8)
    image = cv2.imdecode(image, cv2.IMREAD_COLOR)
    image = cv2.resize(image, (224, 224))
    image = numpy.expand_dims(image, axis=0)
    result = model.predict(image)
    result = int(numpy.argmax(result))
    return result
