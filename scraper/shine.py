from selenium import webdriver
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.common.by import By
from selenium.common.exceptions import TimeoutException

from urllib.parse import quote
from bs4 import BeautifulSoup
from scraper.utils import get_chrome_options


def scrape_shine(keyword):
    encoded = keyword.lower().strip().replace(" ", "-")
    url = f"https://www.shine.com/job-search/{encoded}-jobs?q={encoded}&qActual={quote(keyword)}"

    options = get_chrome_options()
    driver = webdriver.Chrome(options=options)

    try:
        driver.get(url)

        wait = WebDriverWait(driver, 10)

        try:
            wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, "div.jobCardNova_bigCard__W2xn3.jdbigCard")))

        except TimeoutException:
            print(f"No results found on Shine for '{keyword}'.")
            return []

        html = driver.page_source

        soup = BeautifulSoup(html, "html.parser")

        internships = soup.find_all("div", class_="jobCardNova_bigCard__W2xn3")

        results = []

        for internship in internships:
            
            try:
                company_tag = internship.find("span", class_="jobCardNova_bigCardTopTitleName__M_W_m jdTruncationCompany")
                if company_tag:
                    company = company_tag.text.strip()
                else:
                    company = ""


                h3_tag = internship.find("h3", class_="jobCardNova_bigCardTopTitleHeading__Rj2sC jdTruncation")
                profile_tag = h3_tag.find("a") if h3_tag else None
                profile = profile_tag.text.strip() if profile_tag else ""
                link = profile_tag["href"] if profile_tag else ""

                
                location_tag = internship.find("div", class_="jobCardNova_bigCardCenterListLoc__usiPB")
                if location_tag:
                    location = location_tag.text.strip()
                else:
                    location = ""


                experience_tag = internship.find("span", class_="jobCardNova_bigCardCenterListExp__KTSEc")
                if experience_tag:
                    experience = experience_tag.text.strip()
                else:
                    experience = ""

                skills = []
                skill_ul = internship.find("ul", class_="jobCardNova_skillsLists__7YifX d-flex align-items-center")
                if skill_ul:
                    skills_tag = skill_ul.find_all("li")
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
                        "stipend": "",
                        "skills": skills,
                        "link": link
                    })
                    
            except Exception as e:
                print(f"Error parsing internship item: {e}")
                continue


        return results

    finally:
        driver.quit()
