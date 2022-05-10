from flask import Blueprint, request, session, jsonify
from backend.settings import tweets
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer
import re
import string
import nltk
import pandas as pd
from nltk import PorterStemmer, WordNetLemmatizer
from rank_bm25 import *
from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords
import ssl


main = Blueprint("main", __name__)


def preprocess_tweet_text(tweets):
    for tweet in tweets:
        stop_words = set(stopwords.words('english'))
        tweet.lower()
        # Remove urls
        tweet = re.sub(r"http\S+|www\S+|https\S+", '', tweet, flags=re.MULTILINE)
        # Remove user @ references and '#' from tweet
        tweet = re.sub(r'\@\w+|\#', '', tweet)
        # Remove punctuations
        tweet = tweet.translate(str.maketrans('', '', string.punctuation))
        # Remove stopwords
        tweet_tokens = word_tokenize(tweet)
        filtered_words = [w for w in tweet_tokens if w not in stop_words]
        tweet = filtered_words
        # ps = PorterStemmer()
        # stemmed_words = [ps.stem(w) for w in filtered_words]
        # lemmatizer = WordNetLemmatizer()
        # lemma_words = [lemmatizer.lemmatize(w, pos='a') for w in stemmed_words]
    # return " ".join(filtered_words)
    return tweets


def rank(documents, query):

    corpus = documents
    print(query)
    tokenized_corpus = [doc.split(" ") for doc in corpus]
    bm25 = BM25Okapi(tokenized_corpus)
    tokenized_query = query.split(" ")

    return bm25.get_top_n(tokenized_query, corpus, n=20)

sid_obj = SentimentIntensityAnalyzer()


def get_sentiment(sentence):
    sentiment_dict = sid_obj.polarity_scores(sentence)
    if sentiment_dict['compound'] >= 0.05 :
        return "Positive"
    elif sentiment_dict['compound'] <= - 0.05 :
        return "Negative"
    else:
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
    if not start:
        start = 0
    if not end:
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
