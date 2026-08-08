from threading import Thread, Lock
from scraper.internshala import scrape_internshala
from scraper.naukri import scrape_naukri
from scraper.shine import scrape_shine

SCRAPERS = {
    "Internshala": scrape_internshala,
    "Naukri": scrape_naukri,
    "Shine": scrape_shine,
}

lock = Lock()

def run_scraper(site_name, scraper, keyword, results):
    print(f"Starting scraping for {site_name}...")
    try:
        result = scraper(keyword)

        with lock:
            results.extend(result)

    except Exception as e:
        print(f"Error scraping {site_name}: {e}")


def run_all(keyword):
    results = []
    threads = []

    for site_name, scraper in SCRAPERS.items():
        new_thread = Thread(target = run_scraper, args=(site_name, scraper, keyword, results))
        threads.append(new_thread)
        new_thread.start()

    for thread in threads:
        thread.join()

    return results

