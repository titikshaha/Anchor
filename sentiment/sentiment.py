from textblob import TextBlob

def analyze_sentiment(text):
    blob = TextBlob(text)
    polarity = blob.sentiment.polarity
    if polarity > 0.1:
        mood = "Positive"
    elif polarity < -0.1:
        mood = "Negative"
    else:
        mood = "Neutral"
    return {"mood": mood, "polarity": polarity}
