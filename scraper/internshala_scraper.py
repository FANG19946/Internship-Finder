import requests
from bs4 import BeautifulSoup
from urllib.parse import quote

def scrape_internshala(keyword, max_pg=1):
    encoded_keyword = quote(keyword)
    base_url = f"https://internshala.com/internships/keywords-{encoded_keyword}/"

    internships = []

    headers = {
        "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36",
    }

    for page in range(1, max_pg +1):
        if page == 1:
            url = base_url
        else:
            url = f"{base_url}page-{page}/"

        try:
            response = requests.get(url, timeout=10, headers=headers)
            if response.status_code != 200:
                print(f"Failed to retrieve page {page}, status code: {response.status_code}")
                break

            soup = BeautifulSoup(response.text, 'html.parser')
            internship_cards = soup.find_all('div', class_='individual_internship')

            if not internship_cards:
                print("No more internships found, ending scrape.")
                break

            for item in internship_cards:
                try:
                    company_tag = item.find("p", class_="company-name")
                    company_name = company_tag.text.strip() if company_tag else ""

                    profile_tag = item.find("a", class_="job-title-href")
                    if profile_tag:
                        profile_name = profile_tag.text.strip()
                        profile_link = "https://internshala.com" + profile_tag['href']
                    else:
                        profile_name = ""
                        profile_link = ""

                    location_div = item.find("div", class_="row-1-item locations")
                    if location_div:
                        location_tags = location_div.find_all("a")
                        location = ", ".join([loc.text.strip() for loc in location_tags])
                    else:
                        location = ""

                    duration_tag = item.find("i", class_="ic-16-calendar")
                    if duration_tag:
                        duration_span = duration_tag.find_next("span")
                        duration_text = duration_span.text.strip() if duration_span else ""
                    else:
                        duration_text = ""

                    stipend_tag = item.find("span", class_="stipend")
                    stipend_text = stipend_tag.text.strip() if stipend_tag else ""

                    skill_tags = item.find_all("div", class_="job_skill")
                    skill_list = [s.text.strip() for s in skill_tags] if skill_tags else []

                    if company_name:
                        internships.append({
                            "Company": company_name,
                            "Profile": profile_name,
                            "Location": location,
                            "Duration": duration_text,
                            "Stipend": stipend_text,
                            "Skills": skill_list,
                            "Link": profile_link
                        })

                except Exception as e:
                    print(f"Error parsing internship item: {e}")
                    continue

        except requests.RequestException as e:
            print(f"Request failed for page {page}: {e}")
            break

    
    return internships


scrape_internshala("data science")
