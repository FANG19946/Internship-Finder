from selenium import webdriver
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.common.by import By
from selenium.common.exceptions import TimeoutException

from urllib.parse import quote
from bs4 import BeautifulSoup
from scraper.utils import get_chrome_options

def scrape_naukri(keyword):
    query = keyword.lower().strip().replace(" ", "-")
    encoded_keyword = quote(keyword)

    url = f"https://www.naukri.com/{query}-jobs?k={encoded_keyword}&experience=0"

    options = get_chrome_options()
    driver = webdriver.Chrome(options=options)

    try:
        driver.get(url)

        wait = WebDriverWait(driver, 10)

        try:
            wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, "div.cust-job-tuple.layout-wrapper.lay-2.sjw__tuple")))

        except TimeoutException:
            print(f"No results found on Naukri for '{keyword}'.")
            return []

        html = driver.page_source

        soup = BeautifulSoup(html, "html.parser")

        internships = soup.find_all("div", class_="cust-job-tuple")

        results = []

        for internship in internships:
            
            try:
                company_tag = internship.find("a", class_="comp-name")
                if company_tag:
                    company = company_tag.text.strip()
                else:
                    company = ""


                profile_tag = internship.find("a", class_="title")
                if profile_tag:
                    profile = profile_tag.text.strip()
                    link = profile_tag["href"]
                else:
                    profile=""
                    link = ""


                location_tag = internship.find("span", class_="locWdth")
                if location_tag:
                    location = location_tag.text.strip()
                else:
                    location = ""


                experience_tag = internship.find("span", class_="expwdth")
                if experience_tag:
                    experience = experience_tag.text.strip()
                else:
                    experience = ""
                

                stipend_tag = internship.find("span", class_="sal-wrap")
                if stipend_tag:
                    stipend = stipend_tag.text.strip()
                else:
                    stipend = ""

                skills = []
                skill_ul = internship.find("ul", class_="tags-gt")
                if skill_ul:
                    skills_tag = skill_ul.find_all("li", class_="dot-gt tag-li")
                    if skills_tag:
                        for li in skills_tag:
                            skills.append(li.text.strip())

                if company:
                    results.append({
                        "company": company,
                        "profile": profile,
                        "location": location,
                        "duration": "",
                        "experience": experience,
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
