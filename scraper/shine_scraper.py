import requests
from bs4 import BeautifulSoup
from urllib.parse import quote

def scrape_shine(keyword, max_pages=1):
    encoded = keyword.lower().strip().replace(" ", "-")
    base_url = f"https://www.shine.com/job-search/{encoded}-jobs"

    headers = {
        "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36",
    }

    jobs = []

    for page in range(1, max_pages + 1):
        if page == 1 :
            url = base_url 
        else :
            url = f"{base_url}-{page}"

        try:
            res = requests.get(url, headers=headers, timeout=10)
            if res.status_code != 200:
                print(f"Failed on Shine page {page}, status {res.status_code}")
                break

            soup = BeautifulSoup(res.text, "html.parser")

            cards = soup.find_all("div", class_="jobCardNova_bigCard__W2xn3")
            if not cards:
                print("No more Shine jobs found.")
                break

            for card in cards:
                try:
                    h3 = card.find("h3")
                    a = h3.find("a") if h3 else None
                    profile = a.text.strip() if a else ""
                    link = a["href"] if a else ""

                    company_tag = card.find("span", class_="jobCardNova_bigCardTopTitleName__M_W_m jdTruncationCompany")
                    company = company_tag.text.strip() if company_tag else ""

                    duration_tag = card.find("span", class_="jobCardNova_bigCardCenterListExp__KTSEc")
                    duration = duration = duration_tag.text.strip() if duration_tag else ""
                    duration = duration_tag.text.strip() if duration_tag else ""

                    skills = []
                    skills_ul = card.find("ul", class_="jobCardNova_skillsLists__7YifX d-flex align-items-center")
                    if skills_ul:
                        skills = [li.text.strip() for li in skills_ul.find_all("li")]

                    loc_block = card.find("div", class_="jobCardNova_bigCardLocation__OMkI1 d-flex justify-content-start align-items-center")
                    spans = loc_block.find_all("span")
                    location = spans[0].text.strip()
                    
                    jobs.append({
                        "Company": company,
                        "Profile": profile,
                        "Location": location,
                        "Duration": duration,
                        #"Stipend": salary,
                        "Skills": skills,
                        "Link": link
                    })

                except Exception as e:
                    print(f"Error parsing Shine job: {e}")
                    continue

        except Exception as e:
            print(f"Shine request failed: {e}")
            break

    return jobs
