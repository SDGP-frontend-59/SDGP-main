from flask import Flask
import os

# Create the Flask app instance
app = Flask(__name__)

# Define your routes after creating the app instance
@app.route('/')
def home():
    return "Hello, World!"

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)
