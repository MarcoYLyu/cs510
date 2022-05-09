from flask import Blueprint, request, session, jsonify
from backend.settings import tweets
import vaderSentiment
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer

main = Blueprint("main", __name__)

def rank(documents, query):
    """
    TODO: complte this function
    """
    return documents

sid_obj = SentimentIntensityAnalyzer()

def get_sentiment(sentence):
    sentiment_dict = sid_obj.polarity_scores(sentence)
    if sentiment_dict['compound'] >= 0.05 :
        return "Positive"
    elif sentiment_dict['compound'] <= - 0.05 :
        return "Negative"
    else :
        return "Neutral"

@main.route("/", methods=["GET", "POST"])
def home():
    if (request.method == "GET"):
        response = tweets[5]
        return jsonify({"data": response})

@main.route("/query", methods=["POST"])
def query():
    q = request.json.get("query")
    start = request.json.get("from")
    end = request.json.get("to")
    if start == None:
        start = 0
    if end == None:
        end = 10
    reordered_tweets = rank(tweets, q)

    res = []
    for tweet in reordered_tweets[start:end]:
        obj = {
            "text": tweet,
            "sentiment": get_sentiment(tweet)
        }
        res.append(obj)

    return jsonify({"data": res})

@main.route("/get_all_data")
def get_all_tweets():
    return jsonify({"data": tweets})
