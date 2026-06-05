from playwright.sync_api import sync_playwright

def run_test():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        page.goto('http://localhost:3000')
        page.wait_for_load_state('networkidle')
        
        # Click the FAB to open the chat
        fab_selector = 'button[aria-label="Otwórz konsultanta AI"]'
        page.wait_for_selector(fab_selector)
        page.click(fab_selector)
        
        # Wait for chat input
        input_selector = 'input[placeholder="Wpisz np. \'szukam dżemów\', \'chcę schudnąć\'..."]'
        page.wait_for_selector(input_selector)
        
        # Type a message
        page.fill(input_selector, 'Jakie macie białko?')
        
        # Press Enter
        page.press(input_selector, 'Enter')
        
        # Wait for AI response (wait for the AI to type out the response)
        page.wait_for_timeout(6000)
        
        # Get all messages
        messages = page.locator('.animate-fade-up').all()
        for i, msg in enumerate(messages):
            print(f"Message {i}: {msg.text_content().strip()}")
        
        browser.close()

if __name__ == "__main__":
    run_test()
