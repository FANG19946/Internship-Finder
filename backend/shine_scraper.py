import requests
from bs4 import BeautifulSoup
from urllib.parse import quote

def scrape_shine(keyword, max_pages=1):
    encoded = quote(keyword)
    base_url = f"https://www.shine.com/job-search/{encoded}-jobs"

    headers = {
        "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36",
    }

    jobs = []

    for page in range(1, max_pages + 1):
        url = base_url if page == 1 else f"{base_url}/{page}"

        try:
            res = requests.get(url, headers=headers, timeout=10)
            if res.status_code != 200:
                print(f"Failed on Shine page {page}, status {res.status_code}")
                break

            soup = BeautifulSoup(res.text, "html.parser")

            cards = soup.find_all("div", class_="jobCardNova_bigCard__W2xn3 jdbigCard")
            print(cards)

            if not cards:
                print("No more Shine jobs found.")
                break

            for card in cards:
                try:
                    # ----- Profile & Link -----
                    title_tag = card.find("a", class_="jobCardTop_titleHeading__Rj2c6 jdTruncation")
                    profile = title_tag.text.strip() if title_tag else ""
                    link = "https://www.shine.com" + title_tag["href"] if title_tag else ""

                    # ----- Company -----
                    company_tag = card.find("span", class_="jobCardNova_bigCardTopTitleName__M_v_m jdTruncationCompany")
                    company = company_tag.text.strip() if company_tag else ""

                    # ----- Location -----
                    loc_container = card.find("div", class_="jobCardNova_bigCardCenterList__GcAWl")
                    if loc_container:
                        loc_span = loc_container.find("div", class_="jobCardNova_bigCardLocation__0Nkl1 d-flex")
                        location = loc_span.text.strip() if loc_span else ""
                    else:
                        location = ""

                    # ----- Experience / Duration -----
                    exp_span = card.find("span", class_="jobCardNova_bigCardCenterListExp__KT5Ec")
                    duration = exp_span.text.strip() if exp_span else ""

                    # ----- Skills -----
                    skills = []
                    skills_container = card.find("div", class_="jobCardNova_skillsList__TYiVk d-flex")
                    if skills_container:
                        skill_items = skills_container.find_all("li", class_="jobCardNova_setSkills__kMYtq")
                        skills = [s.text.strip() for s in skill_items]

                    jobs.append({
                        "Company": company,
                        "Profile": profile,
                        "Location": location,
                        "Duration": duration,
                        "Stipend": "",
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