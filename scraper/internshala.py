from selenium import webdriver
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.common.by import By
from selenium.common.exceptions import TimeoutException

from urllib.parse import quote
from bs4 import BeautifulSoup
from scraper.utils import get_chrome_options

def scrape_internshala(keyword):
    encoded_keyword = quote(keyword)

    url = f"https://internshala.com/internships/keywords-{encoded_keyword}/"

    options = get_chrome_options()
    driver = webdriver.Chrome(options=options)

    try:
        driver.get(url)

        wait = WebDriverWait(driver, 10)

        try:
            wait.until(EC.presence_of_element_located((By.CLASS_NAME, "individual_internship")))

        except TimeoutException:
            print(f"No results found on Internshala for '{keyword}'.")
            return []

        html = driver.page_source

        soup = BeautifulSoup(html, "html.parser")

        internships = soup.find_all("div", class_="individual_internship")

        results = []

        for internship in internships:

            try:
                company_tag = internship.find("p", class_="company-name")
                if company_tag:
                    company = company_tag.text.strip()
                else:
                    company = ""


                profile_tag = internship.find("a", class_="job-title-href")
                if profile_tag:
                    profile = profile_tag.text.strip()
                    link = "https://internshala.com" + profile_tag["href"]
                else:
                    profile=""
                    link = ""


                location_div = internship.find("div", class_="row-1-item locations")
                if location_div:
                    location_tag = location_div.find("a")
                    if location_tag:
                        location = location_tag.text.strip()
                    else:
                        location = ""
                else:
                    location = ""


                duration_tag = internship.find("i", class_="ic-16-calendar")
                if duration_tag:
                    duration_span = duration_tag.find_next("span")
                    if duration_span:
                        duration = duration_span.text.strip()
                    else:
                        duration = ""
                else:
                    duration = ""

                stipend_tag = internship.find("span", class_="stipend")
                if stipend_tag:
                    stipend = stipend_tag.text.strip()
                else:
                    stipend = ""

                skills = []
                skill_tags = internship.find_all("div", class_="job_skill")
                if skill_tags:
                    for s in skill_tags:
                        skills.append(s.text.strip())

                if company:
                    results.append({
                        "company": company,
                        "profile": profile,
                        "location": location,
                        "duration": duration,
                        "experience": "",
                        "stipend": stipend,
                        "skills": skills,
                        "link": link
                    })
                    
            except Exception as e:
                print(f"Error parsing internship item: {e}")
                continue


        return results

    finally:
        driver.quit()


