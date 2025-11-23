from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from bs4 import BeautifulSoup
from urllib.parse import quote
import time

def scrape_naukri(keyword, max_pg=1):
    query = keyword.replace(' ', '-')
    encoded_keyword = quote(keyword)
    base_url = f"https://www.naukri.com/{query}-jobs?k={encoded_keyword}&experience=0"
    headers = {
        "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36",
    }

    options = Options()
    options.add_argument(f'--user-agent={headers["User-Agent"]}')
    options.add_argument('--headless')

    driver = webdriver.Chrome(service=Service(), options=options)
    driver.get(base_url)

    time.sleep(3)

    soup = BeautifulSoup(driver.page_source, 'html.parser')
    driver.quit()

    cards = soup.find_all('div', class_='cust-job-tuple layout-wrapper lay-2 sjw__tuple')

    internships = []

    for card in cards:
        try:
            company_tag = card.find("a", class_="comp-name")
            company = company_tag.text.strip() if company_tag else ""

            title_tag = card.find("a", class_="title")
            profile = title_tag.text.strip() if title_tag else ""
            job_link = title_tag["href"] if title_tag else ""

            loc_span = card.find("span", class_="locWdth")
            location = loc_span.text.strip() if loc_span else ""
            
            exp_span = card.find("span", class_="expwdth")
            experience_text = exp_span.text.strip() if exp_span else ""

            skill_list = []
            skill_ul = card.find("ul", class_="tags-gt")
            if skill_ul:
                skill_list = [li.text.strip() for li in skill_ul.find_all("li", class_="dot-gt")]
            

            # Construct result in Internshala format
            internships.append({
                "Company": company,
                "Profile": profile,
                "Location": location,
                "Duration": experience_text,
                "Stipend": "",
                "Skills": skill_list,
                "Link": job_link
            })

        except Exception as e:
            print(f"Error parsing internship item: {e}")
            continue

    return internships

print(scrape_naukri("python"))
    