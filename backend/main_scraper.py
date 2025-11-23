from internshala_scraper import scrape_internshala
from naukri_scraper import scrape_naukri    
import pandas as pd

def scrape_all_sites(keyword):

    all_results = []
    
    # --- Site 1: Internshala ---
    results = scrape_internshala(keyword)
    
    if not results:
        print("No results found on Internshala.")

    else:
        all_results.extend(results)

    # --- Site 2: To add support for next site---
    results = scrape_naukri(keyword)
    if not results:
        print("No results found on Naukri.")

    else:
        all_results.extend(results)
    
    return all_results
    
