# Internship Finder and Resume Generator

A webapp which scrapes internship and job listings from multiple sites, ranks them against a user's skill profile, and generates a tailored LaTex resume in one click. Users build a profile with their education, experience, projects and skills. Searching a keyword results in live scraping of websites (which currently includes Internshala, Naukri and Shine) and results are ranked by how well the listing's required skills match the user. From any result, user can generate a resume and export it as `.tex` or `.pdf`

## Tech Stack

- **Backend:** Python, Flask
- **Database:** SQLite3
- **Scraping:** Selenium, BeautifulSoup
- **Resume Generation:** LaTex (compiled via `pdflatex`)
- **Frontend:** HTML, CSS, Jinja

## Setup

### Prerequisites

- Python 3.10+
- Google Chrome installed
- A LaTex distribution with `pdflatex`

### Steps

1. Clone repository
```bash
git clone https://github.com/Dhanush-9/Internship-Finder.git
cd Internship-Finder
```

2. Create and activate a virtual environment
```bash
python -m venv venv

# Linux/macOS
source venv/bin/activate

# Windows
venv\Scripts\activate
```

3. Install dependencies
```bash
pip install -r requirements.txt
```

4. Create a `.env` file in project root
```bash
SECRET_KEY=your-random-secret-key
FLASK_APP=app.py
```

5. Initialize the database
```bash
python db.py
```

6. Run the app
```bash
flask run --debug
```

7. Visit `http://127.0.0.1:5000`


## Future Scope

- Additional scraper sources (e.g. TimesJobs)
- More Resume Templates

## Notes

- Selenium requires a matching ChromeDriver version for your installed Chrome browser. If scraping fails on setup, check that Chrome and ChromeDriver versions are compatible.