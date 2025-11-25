from bs4 import BeautifulSoup
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
import time

def scrape_timesjobs(keyword, max_pages=1):

    options = Options()
    options.add_argument("--headless=new")
    driver = webdriver.Chrome(options=options)

    url = f"https://www.timesjobs.com/job-search?keywords={keyword.replace(' ', '+')}&location=&experience=&refreshed=true"
    driver.get(url)
    time.sleep(2)

    jobs = []

    for page in range(1, max_pages + 1):
        soup = BeautifulSoup(driver.page_source, "html.parser")
        cards = soup.find_all("div", class_="srp-card")

        for card in cards:
            h2 = card.find("h2")
            profile = h2.text.strip() if h2 else ""

            a = card.find("a") if card else None
            link = a["href"] if a else ""

            company_tag = h2.find_next("span") if h2 else None
            company = company_tag.text.strip() if company_tag else ""

            location = ""
            for span in card.find_all("span"):
                if "font-semibold" in span.get("class", []):
                    location = span.text.strip()
                    break

            experience = ""
            for span in card.find_all("span"):
                if "Yrs" in span.text:
                    experience = span.text.strip()
                    
            salary_tag = card.find("span", class_="mr-0 inline")
            salary = salary_tag.text.strip() if salary_tag else ""

            skills = [s.text.strip() for s in card.find_all("span", class_="skill-tag")]

            jobs.append({
                "Company": company,
                "Profile": profile,
                "Location": location,
                "Duration": experience,
                "Stipend": salary,
                "Skills": skills,
                "Link": link
            })

        try:
            next_btn = driver.find_element(By.CSS_SELECTOR, "button.pagination-next")
            driver.execute_script("arguments[0].click();", next_btn)
            time.sleep(1.5)
        
        except Exception as e:
            print("Pagination failed:", e)
            break


    driver.quit()
    return jobs
