from .settings import app
from .views.main_view import main

app.register_blueprint(main)
