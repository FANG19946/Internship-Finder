# from internshala_scraper import scrape_internshala
# from naukri_scraper import scrape_naukri 
# from shine_scraper import scrape_shine
# from timesjob_scraper import scrape_timesjobs 

# def scrape_all_sites(keyword):

#     all_results = []
    
#     # --- Internshala ---
#     results = scrape_internshala(keyword)
    
#     if not results:
#         print("No results found on Internshala.")

#     else:
#         all_results.extend(results)

#     # --- Naukri ---
#     results = scrape_naukri(keyword)
#     if not results:
#         print("No results found on Naukri.")

#     else:
#         all_results.extend(results)


#     # --- Shine.com ---
#     results = scrape_shine(keyword)
#     if results:
#         all_results.extend(results)

#     # --- TimesJobs ---
#     results = scrape_timesjobs(keyword)
#     if results:
#         all_results.extend(results)
#     else:
#         print("No results found on TimesJobs.")

#     return all_results
    
from internshala_scraper import scrape_internshala
from naukri_scraper import scrape_naukri 
from shine_scraper import scrape_shine
from timesjob_scraper import scrape_timesjobs
import threading

results_lock = threading.Lock()

SCRAPERS = {
    "Internshala": scrape_internshala,
    #"Naukri": scrape_naukri,
    "Shine": scrape_shine,
    #"TimesJobs": scrape_timesjobs
}

def scrape_single_site(site_name, scraper_func, keyword, all_results):
    """
    Function executed by each thread to scrape a single site.
    """
    print(f"Starting scraping for {site_name}...")
    try:
        results = scraper_func(keyword)
        
        if results:
            # Use the lock before modifying the shared list
            with results_lock:
                all_results.extend(results)
                print(f"Successfully added {len(results)} results from {site_name}.")
        else:
            print(f"No results found on {site_name}.")

    except Exception as e:
        print(f"Error scraping {site_name}: {e}")


def scrape_all_sites(keyword):
    
    all_results = []
    threads = []
    
    for site_name, scraper_func in SCRAPERS.items():
        # Create a new thread for each scraper function
        thread = threading.Thread(
            target=scrape_single_site,
            args=(site_name, scraper_func, keyword, all_results) # Arguments to pass to the target function
        )
        threads.append(thread)
        thread.start() # Start the thread immediately

    # Wait for all threads to complete their execution
    for thread in threads:
        thread.join()

    print(f"All scraping threads finished. Total results collected: {len(all_results)}")
    return all_results