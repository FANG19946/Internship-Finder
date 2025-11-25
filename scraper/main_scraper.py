from internshala_scraper import scrape_internshala
from naukri_scraper import scrape_naukri 
from shine_scraper import scrape_shine
from timesjob_scraper import scrape_timesjobs 
import pandas as pd

def scrape_all_sites(keyword):

    all_results = []
    
    # --- Internshala ---
    results = scrape_internshala(keyword)
    
    if not results:
        print("No results found on Internshala.")

    else:
        all_results.extend(results)

    # --- Naukri ---
    results = scrape_naukri(keyword)
    if not results:
        print("No results found on Naukri.")

    else:
        all_results.extend(results)


    # --- Shine.com ---
    results = scrape_shine(keyword)
    if results:
        all_results.extend(results)

    # --- TimesJobs ---
    results = scrape_timesjobs(keyword)
    if results:
        all_results.extend(results)
    else:
        print("No results found on TimesJobs.")

    return all_results
    
