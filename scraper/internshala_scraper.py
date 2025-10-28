from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.common.exceptions import WebDriverException, TimeoutException
from bs4 import BeautifulSoup
from urllib.parse import quote
import time

def scrape_internshala(keyword, max_pg=5):
    encoded_keyword = quote(keyword)
    base_url = f"https://internshala.com/internships/{encoded_keyword}-internship/"

    options = Options()
    options.add_argument('--headless')

    try:
        driver = webdriver.Chrome(options=options)
        driver.set_page_load_timeout(10)

    except WebDriverException as e:
        print(f"Selenium WebDriver initialization failed: {e}")
        return []
    
    internships = []
    page = 1

    while page <= max_pg:

        if page == 1:
            url = base_url

        else:
            url = f"{base_url}page-{page}/"

        try:
            driver.get(url)
            soup = BeautifulSoup(driver.page_source, 'html.parser')

            internship = soup.find_all('div', class_='individual_internship')

            if not internship:
                print("No more internships found, ending scrape.")
                break

            for item in internship:
                try:
                    # -- Company Name --
                    company_tag = item.find("p", class_="company-name")
                    company_name = company_tag.text.strip() if company_tag else ""

                    # -- Profile --
                    profile_tag = item.find("a", class_="job-title-href")
                    profile_name = profile_tag.text.strip() if profile_tag else ""

                    # --- Location ---
                    location_div = item.find("div", class_="row-1-item locations")
                    if location_div:
                        location_tags = location_div.find_all("a")  # inside span(s)
                        location = ", ".join([loc.text.strip() for loc in location_tags])
                    else:
                        location = ""

                    # --- Duration ---
                    duration_tag = item.find("i", class_="ic-16-calendar")
                    if duration_tag:
                        duration_span = duration_tag.find_next("span")
                        duration_text = duration_span.text.strip() if duration_span else ""
                    else:
                        duration_text = ""

                    # --- Stipend ---
                    stipend_tag = item.find("span", class_="stipend")
                    stipend_text = stipend_tag.text.strip() if stipend_tag else ""

                    # --- Skills ---
                    skill_tags = item.find_all("div", class_="job_skill")
                    skill_list = [s.text.strip() for s in skill_tags] if skill_tags else []

                    if company_name:
                        internships.append({
                            "Company": company_name,
                            "Profile": profile_name,
                            "Location": location,
                            "Duration": duration_text,
                            "Stipend": stipend_text,
                            "Skills": skill_list
                        })
                except Exception as e:
                    print(f"Skipping card: {e}")
                    continue

        except TimeoutException:
            print(f"Timeout while loading page {page}")
            break

        except Exception as e:
            print(f"Error on page {page}: {e}")
            break

        page += 1

    driver.quit()
    return internships

            