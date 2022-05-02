from flask import Blueprint, request, session, jsonify
from backend.settings import tweets

main = Blueprint("main", __name__)

def rank(documents, query):
    """
    TODO: complte this function
    """
    return documents

def get_sentiment(sentence):
    """
    TODO: return the sentiment of the sentiment
    """
    sentiment = None
    return sentiment

@main.route("/", methods=["GET", "POST"])
def home():
    if (request.method == "GET"):
        response = tweets[5]
        return jsonify({"data": response})

@main.route("/query", methods=["GET"])
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
