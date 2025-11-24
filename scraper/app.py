from flask import Flask, request, jsonify
from flask_cors import CORS
from main_scraper import scrape_all_sites

app = Flask(__name__)
CORS(app)  # allow frontend to access backend

@app.route('/api/scrape', methods=['GET'])
def scrape_jobs():
    keyword = request.args.get('keyword', 'developer')
    print(f"Scraping jobs for keyword: {keyword}")

    try:
        results = scrape_all_sites(keyword)
        if not results:
            return jsonify({"message": "No results found."}), 404
        return jsonify(results), 200
    
    except Exception as e:
        print(f"Error while scraping: {e}")
        return jsonify({"error": str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True)
