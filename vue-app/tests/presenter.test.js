/**
 * E2E Tests for Presenter View UX
 * Tests the complete user flow for quiz presentation
 *
 * Run with: npm run test:e2e
 * Run with browser visible: npm run test:e2e:headed
 */

import { openBrowser, goto, closeBrowser, press, text, screenshot, waitFor, $ } from 'taiko';
import assert from 'assert';

const BASE_URL = process.env.BASE_URL || 'http://localhost:5173';
const ENABLE_SCREENSHOTS = process.env.SCREENSHOTS === 'true' || process.env.CI === 'true';

/**
 * Wait for a condition to be true with timeout
 * More efficient than fixed waitFor() calls
 */
async function waitForCondition(conditionFn, timeout = 5000, checkInterval = 100) {
  const start = Date.now();
  while (Date.now() - start < timeout) {
    try {
      if (await conditionFn()) return true;
    } catch (e) {
      // Ignore errors during checks
    }
    await waitFor(checkInterval);
  }
  throw new Error(`Condition not met within ${timeout}ms`);
}

/**
 * Take screenshot only if enabled (CI or explicit flag)
 */
async function conditionalScreenshot(path) {
  if (ENABLE_SCREENSHOTS) {
    await screenshot({ path });
    console.log(`📸 Screenshot saved: ${path}`);
  }
}

(async () => {
  try {
    // Open browser with optimized performance settings
    console.log('🚀 Opening browser...');
    await openBrowser({
      headless: process.env.HEADLESS !== 'false',
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
        '--disable-extensions',
        '--disable-software-rasterizer',
        '--disable-background-timer-throttling',
        '--disable-backgrounding-occluded-windows',
        '--disable-renderer-backgrounding',
      ],
    });

    // Test 1: Load presenter view
    console.log('\n✅ Test 1: Loading presenter view...');
    await goto(`${BASE_URL}/#/presenter`);

    // Wait for Vue to render (smart wait)
    await waitForCondition(async () => await text('Foto 1 / 23').exists());
    console.log('✓ Presenter view loaded successfully');

    // Test 2: Photo fullscreen initially
    console.log('\n✅ Test 2: Checking initial fullscreen state...');
    assert(await text('Mezerník zobrazí otázky').exists(), 'Fullscreen hint should be visible');
    console.log('✓ Photo is fullscreen initially');

    // Test 3: Toggle questions with spacebar
    console.log('\n✅ Test 3: Toggling questions with spacebar...');
    await press('Space');

    // Wait for questions to appear
    await waitForCondition(async () => await text(/Který|Kde|Co|Jak/).exists());
    assert(await text('Mezerník skryje').exists(), 'Hide hint should be visible');
    console.log('✓ Questions toggle with spacebar works');

    // Take screenshot (conditional)
    await conditionalScreenshot('tests/screenshots/presenter-questions.png');

    // Test 4: Navigate between questions
    console.log('\n✅ Test 4: Navigating between questions...');
    await press('ArrowDown');
    await waitFor(200); // Reduced wait for UI transitions
    console.log('✓ Pressed down arrow (question 2)');

    await press('ArrowDown');
    await waitFor(200); // Reduced wait for UI transitions
    console.log('✓ Pressed down arrow (question 3)');

    await press('ArrowUp');
    await waitFor(200); // Reduced wait for UI transitions
    console.log('✓ Pressed up arrow (back to question 2)');

    await press('ArrowUp');
    await waitFor(200); // Reduced wait for UI transitions
    console.log('✓ Pressed up arrow (back to question 1)');

    // Test 5: Reveal answer
    console.log('\n✅ Test 5: Revealing correct answer...');
    await press('a');

    // Wait for answer reveal animation
    await waitForCondition(async () => await text('✓').exists());
    console.log('✓ Answer revealed successfully');

    // Take screenshot (conditional)
    await conditionalScreenshot('tests/screenshots/presenter-answer.png');

    // Test 6: Hide questions
    console.log('\n✅ Test 6: Hiding questions...');
    await press('Space');
    await waitFor(200); // Reduced wait for UI transitions
    assert(await text('Mezerník zobrazí otázky').exists(), 'Questions should be hidden');
    console.log('✓ Questions hidden successfully');

    // Test 7: Navigate to next photo
    console.log('\n✅ Test 7: Navigating to next photo...');
    await press('ArrowRight');

    // Wait for photo change
    await waitForCondition(async () => await text('Foto 2 / 23').exists());
    console.log('✓ Navigated to next photo');

    // Test 8: Navigate back
    console.log('\n✅ Test 8: Navigating back to previous photo...');
    await press('ArrowLeft');

    // Wait for photo change
    await waitForCondition(async () => await text('Foto 1 / 23').exists());
    console.log('✓ Navigated back to previous photo');

    // Test 9: Photo navigation blocked when questions visible
    console.log('\n✅ Test 9: Testing navigation block with visible questions...');
    await press('Space');
    await waitFor(200); // Reduced wait for UI transitions
    await press('ArrowRight');
    await waitFor(200); // Reduced wait for UI transitions
    assert(await text('Foto 1 / 23').exists(), 'Should still be on photo 1');
    console.log('✓ Photo navigation correctly blocked when questions visible');

    // Test 10: ESC to hide questions
    console.log('\n✅ Test 10: Testing ESC to hide questions...');
    await press('Escape');
    await waitFor(200); // Reduced wait for UI transitions
    assert(await text('Mezerník zobrazí otázky').exists(), 'Questions should be hidden');
    console.log('✓ ESC hides questions successfully');

    // Test 11: Complete user flow
    console.log('\n✅ Test 11: Running complete user flow...');
    console.log('  1. Showing questions...');
    await press('Space');
    await waitFor(200); // Reduced wait for UI transitions

    console.log('  2. Cycling through all 3 questions...');
    for (let i = 0; i < 2; i++) {
      await press('ArrowDown');
      await waitFor(300);
    }

    console.log('  3. Revealing answer...');
    await press('a');
    await waitFor(200); // Reduced wait for UI transitions

    console.log('  4. Hiding questions...');
    await press('Space');
    await waitFor(200); // Reduced wait for UI transitions

    console.log('  5. Navigating to next photo...');
    await press('ArrowRight');

    // Wait for final photo change
    await waitForCondition(async () => await text('Foto 2 / 23').exists());
    console.log('✓ Complete user flow executed successfully');

    // Take final screenshot (conditional)
    await conditionalScreenshot('tests/screenshots/presenter-initial.png');

    console.log('\n🎉 All tests passed!');
    console.log('📊 Summary: 11 tests executed successfully');
    if (ENABLE_SCREENSHOTS) {
      console.log('📸 3 screenshots saved in tests/screenshots/');
    }
  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    await screenshot({ path: 'tests/screenshots/error.png' });
    console.error('📸 Error screenshot saved: error.png');
    process.exit(1);
  } finally {
    await closeBrowser();
    console.log('\n👋 Browser closed');
  }
})();
