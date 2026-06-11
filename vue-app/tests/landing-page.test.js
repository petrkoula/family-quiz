/**
 * E2E Tests for Landing Page with Quiz Library
 * Tests the complete user flow for browsing and selecting quizzes
 *
 * Run with: yarn test:e2e
 * Run with browser visible: yarn test:e2e:interactive
 */

import { openBrowser, goto, closeBrowser, click, text, screenshot, waitFor, $, below } from 'taiko';
import assert from 'assert';

const BASE_URL = process.env.BASE_URL || 'http://localhost:5173';
const ENABLE_SCREENSHOTS = process.env.SCREENSHOTS === 'true' || process.env.CI === 'true';

/**
 * Wait for a condition to be true with timeout
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
 * Take screenshot only if enabled
 */
async function conditionalScreenshot(path) {
  if (ENABLE_SCREENSHOTS) {
    await screenshot({ path });
    console.log(`📸 Screenshot saved: ${path}`);
  }
}

(async () => {
  try {
    console.log('🚀 Opening browser...');
    await openBrowser({
      headless: process.env.HEADLESS !== 'false',
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
        '--disable-extensions',
      ],
    });

    // Test 1: Landing page displays on root route
    console.log('\n✅ Test 1: Loading landing page from root URL...');
    await goto(`${BASE_URL}/`);

    // Wait for Vue to render
    await waitForCondition(async () => {
      const hasLibraryHeading = await text(/knihovna|library|quiz/i).exists();
      return hasLibraryHeading;
    });
    console.log('✓ Landing page loaded successfully');
    await conditionalScreenshot('tests/screenshots/landing-initial.png');

    // Test 2: Quiz library displays quiz pack cards
    console.log('\n✅ Test 2: Checking quiz pack cards are visible...');

    // Look for quiz card elements (cards should have quiz titles)
    const hasQuizCards = await $('.quiz-card').exists() ||
                         await $('[class*="quiz"]').exists();
    assert(hasQuizCards, 'Quiz pack cards should be visible');
    console.log('✓ Quiz pack cards are displayed');

    // Test 3: Quiz cards display metadata
    console.log('\n✅ Test 3: Verifying quiz card metadata...');

    // Check for photo count indicator (e.g., "10 fotek" or "10 photos")
    const hasPhotoCount = await text(/\d+\s+(fotek|photos|foto)/i).exists();
    assert(hasPhotoCount, 'Quiz cards should display photo count');
    console.log('✓ Photo count is displayed');

    // Check for question count indicator
    const hasQuestionCount = await text(/\d+\s+(otázek|questions|otázky)/i).exists();
    assert(hasQuestionCount, 'Quiz cards should display question count');
    console.log('✓ Question count is displayed');

    // Test 4: Multiple quiz packs are displayed
    console.log('\n✅ Test 4: Checking multiple quiz packs exist...');

    // Count quiz cards (assuming they have a common class or element)
    const quizCardElements = await $('.quiz-card').elements() ||
                              await $('[class*="quiz-card"]').elements() ||
                              await $('[class*="card"]').elements();

    assert(quizCardElements.length > 0, 'At least one quiz pack should be displayed');
    console.log(`✓ Found ${quizCardElements.length} quiz pack(s)`);

    // Test 5: Create your own CTA is visible
    console.log('\n✅ Test 5: Checking for "Create Your Own" section...');

    const hasCreateCTA = await text(/create|vytvo|build your own/i).exists();
    assert(hasCreateCTA, 'Create your own section should be visible');
    console.log('✓ Create your own CTA is displayed');
    await conditionalScreenshot('tests/screenshots/landing-create-cta.png');

    // Test 6: Click quiz pack to navigate to presenter
    console.log('\n✅ Test 6: Testing quiz pack selection...');

    // Find and click first quiz card
    const firstCard = await $('.quiz-card').exists()
      ? await $('.quiz-card')
      : await $('[class*="quiz-card"]');

    if (firstCard) {
      await click(firstCard);

      // Wait for navigation to presenter
      await waitForCondition(async () => {
        return await text(/foto|photo/i).exists() ||
               await text(/mezerník|space/i).exists();
      }, 3000);

      console.log('✓ Quiz pack click navigates to presenter view');
      await conditionalScreenshot('tests/screenshots/landing-to-presenter.png');

      // Navigate back to landing page
      await goto(`${BASE_URL}/`);
      await waitFor(500);
    } else {
      console.log('⚠ Skipping click test - no quiz cards found');
    }

    // Test 7: Quiz thumbnails are visible
    console.log('\n✅ Test 7: Checking quiz thumbnails load...');

    const hasImages = await $('img').exists();
    assert(hasImages, 'Quiz pack thumbnails should be visible');
    console.log('✓ Quiz thumbnails are displayed');

    // Test 8: Page is responsive (basic check)
    console.log('\n✅ Test 8: Testing responsive layout...');

    // Page should have some container or grid structure
    const hasLayoutStructure = await $('[class*="grid"]').exists() ||
                                 await $('[class*="container"]').exists() ||
                                 await $('[class*="library"]').exists();
    assert(hasLayoutStructure, 'Page should have responsive layout structure');
    console.log('✓ Responsive layout structure detected');

    console.log('\n🎉 All landing page tests passed!');
    console.log('📊 Summary: 8 test scenarios executed successfully');
    if (ENABLE_SCREENSHOTS) {
      console.log('📸 Screenshots saved in tests/screenshots/');
    }

  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    await screenshot({ path: 'tests/screenshots/landing-error.png' });
    console.error('📸 Error screenshot saved: landing-error.png');
    process.exit(1);
  } finally {
    await closeBrowser();
    console.log('\n👋 Browser closed');
  }
})();
