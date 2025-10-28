from internshala_scraper import scrape_internshala
import pandas as pd

def scrape_all_sites(keyword):

    
    # --- Site 1: Internshala ---
    print("Scraping Internshala...")
    
    results = scrape_internshala(keyword)

    if not results:
        print("No results found on Internshala.")


    # --- Site 2: To add support for next site---



    # --- Save results to CSV ---
    df = pd.DataFrame(results)
    filename = f"internshala_{keyword.replace(' ', '_')}.csv"
    df.to_csv(filename, index=False)
    print(f"Results saved to {filename}")

if __name__ == "__main__":
    
    keyword = input("Enter keyword: ")
    print(f"--- STARTING TEST SCRAPE for '{keyword}' ---")
    scrape_all_sites(keyword)
    print("--- TEST SCRAPE COMPLETE ---")
    
