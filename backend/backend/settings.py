from flask import Flask
import pandas as pd

app = Flask(__name__, instance_relative_config=True)

app.config.from_pyfile("instance.cfg")

df = pd.read_csv("instance/data.csv", encoding="latin-1")

tweets = df.iloc[:, -1].tolist()