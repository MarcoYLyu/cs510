from flask import Flask
import sqlalchemy

app = Flask(__name__, instance_relative_config=True)

app.config.from_pyfile("instance.cfg")


