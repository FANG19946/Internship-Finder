from selenium.webdriver.chrome.options import Options

USER_AGENT = "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36"


def get_chrome_options():
    options = Options()
    options.add_argument("--headless=new")
    options.add_argument(f"--user-agent={USER_AGENT}")

    return options