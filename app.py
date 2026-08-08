import os
from dotenv import load_dotenv
from flask import Flask

load_dotenv()
app = Flask(__name__)
app.secret_key = os.environ["SECRET_KEY"]

#import routes

from routes import auth, profile

if __name__ == "__main__":
    app.run(debug=True)