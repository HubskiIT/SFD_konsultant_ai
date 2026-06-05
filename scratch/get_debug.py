from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page()
    page.goto('http://localhost:3000/debug')
    page.wait_for_selector('#debug-output')
    print(page.locator('#debug-output').text_content())
    browser.close()
