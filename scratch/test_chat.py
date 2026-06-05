from playwright.sync_api import sync_playwright

def run_test():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        print("Navigating to http://localhost:3000...")
        page.goto('http://localhost:3000')
        page.wait_for_load_state('networkidle')
        
        # Click the FAB to open the chat
        print("Opening chat widget...")
        fab_selector = 'button[aria-label="Otwórz konsultanta AI"]'
        page.wait_for_selector(fab_selector)
        page.click(fab_selector)
        
        # Wait for chat input
        print("Waiting for chat input...")
        input_selector = 'input[placeholder="Wpisz np. \'szukam dżemów\', \'chcę schudnąć\'..."]'
        page.wait_for_selector(input_selector)
        
        # Type a message
        print("Typing message...")
        page.fill(input_selector, 'Test wiadomości AI')
        
        # Take a screenshot before sending
        page.screenshot(path='scratch/chat_input_test.png')
        print("Screenshot saved to scratch/chat_input_test.png")
        
        browser.close()

if __name__ == "__main__":
    run_test()
