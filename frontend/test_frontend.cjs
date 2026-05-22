const { chromium } = require('playwright');

(async () => {
    const browser = await chromium.launch();
    const context = await browser.newContext();
    const page = await context.newPage();

    page.on('console', msg => {
        if (msg.type() === 'error') {
            console.error(`Browser Error: ${msg.text()}`);
        }
    });
    
    page.on('pageerror', error => {
        console.error(`Page Error: ${error.message}`);
    });

    console.log("Navigating to localhost:5173...");
    try {
        await page.goto('http://localhost:5173');
        await page.waitForTimeout(2000);
        
        console.log("Typing login credentials...");
        await page.fill('input[type="email"]', 'evt.coord1@frolic.com');
        await page.fill('input[type="password"]', 'coord123');
        await page.click('button[type="submit"]');
        
        console.log("Waiting for navigation...");
        await page.waitForTimeout(3000);
        
        console.log("Current URL:", page.url());
        
        // Take a screenshot
        await page.screenshot({ path: 'screenshot.png' });
        console.log("Screenshot saved.");
        
    } catch (e) {
        console.error("Test failed:", e);
    }

    await browser.close();
})();
