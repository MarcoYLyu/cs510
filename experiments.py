from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer
from sklearn.metrics import accuracy_score, confusion_matrix
import pandas as pd

sid_obj = SentimentIntensityAnalyzer()

def get_sentiment(sentence):
    sentiment_dict = sid_obj.polarity_scores(sentence)
    if sentiment_dict['compound'] >= 0 :
        return "4"
    else:
        return "0"


datadir = "./backend/instance/data.csv"
df = pd.read_csv(datadir, encoding="latin-1")

tweets = df.iloc[:, -1].tolist()
labels = df.iloc[:, 0].tolist()
labels = [str(itr) for itr in labels]
preds = []

for i, tweet in enumerate(tweets):
    if i % 100000 == 0:
        print(f"Iteration {i}")
    preds.append(get_sentiment(tweet))

print("The accuracy score is", accuracy_score(labels, preds))

tn, fp, fn, tp = confusion_matrix(labels, preds).ravel()

print(tn, fp, fn, tp)